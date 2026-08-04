"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
const supabase_js_1 = require("@supabase/supabase-js");
const sharp_1 = __importDefault(require("sharp"));
const router = (0, express_1.Router)();
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// =======================
// AUTH
// =======================
router.post('/login', (0, express_async_handler_1.default)(async (req, res) => {
    const { password } = req.body;
    let admin = await prisma.adminUser.findUnique({ where: { id: 'admin' } });
    if (!admin) {
        // Seed initial password if none exists
        const hashed = await bcryptjs_1.default.hash('gazette2024', 10);
        admin = await prisma.adminUser.create({ data: { id: 'admin', password: hashed } });
    }
    const isValid = await bcryptjs_1.default.compare(password, admin.password);
    if (isValid) {
        const token = jsonwebtoken_1.default.sign({ role: 'admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.json({ token });
    }
    else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
}));
// Middleware to protect admin routes
const requireAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
router.put('/admin/password', requireAdmin, (0, express_async_handler_1.default)(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const admin = await prisma.adminUser.findUnique({ where: { id: 'admin' } });
    if (!admin) {
        res.status(404).json({ error: 'Admin not found' });
        return;
    }
    const isValid = await bcryptjs_1.default.compare(currentPassword, admin.password);
    if (!isValid) {
        res.status(401).json({ error: 'Incorrect current password' });
        return;
    }
    const hashed = await bcryptjs_1.default.hash(newPassword, 10);
    await prisma.adminUser.update({ where: { id: 'admin' }, data: { password: hashed } });
    res.json({ success: true });
}));
// =======================
// SKETCHES (Gallery)
// =======================
router.get('/sketches', (0, express_async_handler_1.default)(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const cursor = req.query.cursor;
    if (limit) {
        const sketches = await prisma.sketch.findMany({
            take: limit + 1,
            ...(cursor && {
                skip: 1,
                cursor: { id: cursor }
            }),
            orderBy: { createdAt: 'desc' }
        });
        let hasMore = false;
        if (sketches.length > limit) {
            hasMore = true;
            sketches.pop();
        }
        res.json({ data: sketches, hasMore });
    }
    else {
        const sketches = await prisma.sketch.findMany({ orderBy: { createdAt: 'desc' } });
        res.json({ data: sketches, hasMore: false }); // Or simply adapt frontend to `{ data }`
    }
}));
router.post('/sketches', requireAdmin, upload.single('image'), (0, express_async_handler_1.default)(async (req, res) => {
    const { title, category, description, medium, year, purchaseUrl } = req.body;
    let imageUrl = req.body.imageUrl; // Fallback to provided URL if not uploading a file
    if (req.file) {
        let buffer = req.file.buffer;
        let contentType = req.file.mimetype;
        let fileName = req.file.originalname;
        if (contentType.startsWith('image/')) {
            buffer = await (0, sharp_1.default)(req.file.buffer)
                .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 80, progressive: true })
                .toBuffer();
            contentType = 'image/jpeg';
            fileName = fileName.replace(/\.[^/.]+$/, "") + ".jpeg";
        }
        const uniqueFileName = `${Date.now()}-${fileName.replace(/\s/g, '_')}`;
        const { error } = await supabase.storage
            .from('sketches')
            .upload(uniqueFileName, buffer, {
            contentType: contentType,
        });
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        const { data: publicUrlData } = supabase.storage
            .from('sketches')
            .getPublicUrl(uniqueFileName);
        imageUrl = publicUrlData.publicUrl;
    }
    const sketch = await prisma.sketch.create({
        data: { title, category, description, medium, year, imageUrl, purchaseUrl }
    });
    res.status(201).json(sketch);
}));
router.put('/sketches/:id', requireAdmin, upload.single('image'), (0, express_async_handler_1.default)(async (req, res) => {
    const { title, category, description, medium, year, purchaseUrl } = req.body;
    let updateData = { title, category, description, medium, year, purchaseUrl };
    if (req.file) {
        const fileName = `${Date.now()}-${req.file.originalname.replace(/\s/g, '_')}`;
        const { error } = await supabase.storage
            .from('sketches')
            .upload(fileName, req.file.buffer, {
            contentType: req.file.mimetype,
        });
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        const { data: publicUrlData } = supabase.storage
            .from('sketches')
            .getPublicUrl(fileName);
        updateData.imageUrl = publicUrlData.publicUrl;
    }
    else if (req.body.imageUrl) {
        updateData.imageUrl = req.body.imageUrl;
    }
    const sketch = await prisma.sketch.update({
        where: { id: req.params.id },
        data: updateData
    });
    res.json(sketch);
}));
router.delete('/sketches/:id', requireAdmin, (0, express_async_handler_1.default)(async (req, res) => {
    await prisma.sketch.delete({ where: { id: req.params.id } });
    res.json({ success: true });
}));
// =======================
// BLOG POSTS
// =======================
router.get('/blogs', (0, express_async_handler_1.default)(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const cursor = req.query.cursor;
    if (limit) {
        const blogs = await prisma.blogPost.findMany({
            take: limit + 1,
            ...(cursor && {
                skip: 1,
                cursor: { id: cursor }
            }),
            orderBy: { createdAt: 'desc' }
        });
        let hasMore = false;
        if (blogs.length > limit) {
            hasMore = true;
            blogs.pop();
        }
        res.json({ data: blogs, hasMore });
    }
    else {
        const blogs = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
        res.json({ data: blogs, hasMore: false });
    }
}));
router.post('/blogs', requireAdmin, (0, express_async_handler_1.default)(async (req, res) => {
    const blog = await prisma.blogPost.create({ data: req.body });
    res.status(201).json(blog);
}));
router.put('/blogs/:id', requireAdmin, (0, express_async_handler_1.default)(async (req, res) => {
    const blog = await prisma.blogPost.update({
        where: { id: req.params.id },
        data: req.body
    });
    res.json(blog);
}));
router.delete('/blogs/:id', requireAdmin, (0, express_async_handler_1.default)(async (req, res) => {
    await prisma.blogPost.delete({ where: { id: req.params.id } });
    res.json({ success: true });
}));
// =======================
// MESSAGES (Contact)
// =======================
router.get('/messages', requireAdmin, (0, express_async_handler_1.default)(async (req, res) => {
    const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(messages);
}));
router.post('/messages', (0, express_async_handler_1.default)(async (req, res) => {
    const message = await prisma.message.create({ data: req.body });
    res.status(201).json(message);
}));
router.delete('/messages/:id', requireAdmin, (0, express_async_handler_1.default)(async (req, res) => {
    await prisma.message.delete({ where: { id: req.params.id } });
    res.json({ success: true });
}));
// =======================
// SETTINGS (Links)
// =======================
router.get('/settings', (0, express_async_handler_1.default)(async (req, res) => {
    let settings = await prisma.settings.findUnique({ where: { id: 'global' } });
    if (!settings) {
        settings = await prisma.settings.create({ data: { id: 'global' } });
    }
    res.json(settings);
}));
router.put('/settings', requireAdmin, (0, express_async_handler_1.default)(async (req, res) => {
    const settings = await prisma.settings.upsert({
        where: { id: 'global' },
        update: req.body,
        create: { id: 'global', ...req.body }
    });
    res.json(settings);
}));
exports.default = router;
