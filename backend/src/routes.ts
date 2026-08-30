import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const router = Router();
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const upload = multer({ storage: multer.memoryStorage() });

// =======================
// AUTH
// =======================
router.post('/login', asyncHandler(async (req, res) => {
  const { password } = req.body;
  
  let admin = await prisma.adminUser.findUnique({ where: { id: 'admin' } });
  
  if (!admin) {
    // Seed initial password if none exists
    const hashed = await bcrypt.hash('gazette2024', 10);
    admin = await prisma.adminUser.create({ data: { id: 'admin', password: hashed } });
  }

  const isValid = await bcrypt.compare(password, admin.password);
  
  if (isValid) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
}));

// Middleware to protect admin routes
const requireAdmin = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'secret');
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.put('/admin/password', requireAdmin, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = await prisma.adminUser.findUnique({ where: { id: 'admin' } });
  
  if (!admin) {
    res.status(404).json({ error: 'Admin not found' });
    return;
  }
  
  const isValid = await bcrypt.compare(currentPassword, admin.password);
  if (!isValid) {
    res.status(401).json({ error: 'Incorrect current password' });
    return;
  }
  
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.adminUser.update({ where: { id: 'admin' }, data: { password: hashed } });
  
  res.json({ success: true });
}));

// =======================
// SKETCHES (Gallery)
// =======================
router.get('/sketches', asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
  const cursor = req.query.cursor as string | undefined;

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
  } else {
    const sketches = await prisma.sketch.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ data: sketches, hasMore: false }); // Or simply adapt frontend to `{ data }`
  }
}));

router.post('/sketches', requireAdmin, upload.single('image'), asyncHandler(async (req, res) => {
  const { title, category, description, medium, year, purchaseUrl } = req.body;
  let imageUrl = req.body.imageUrl; // Fallback to provided URL if not uploading a file

  if (req.file) {
    let buffer = req.file.buffer;
    let contentType = req.file.mimetype;
    let fileName = req.file.originalname;

    if (contentType.startsWith('image/')) {
      buffer = await sharp(req.file.buffer)
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

router.put('/sketches/:id', requireAdmin, upload.single('image'), asyncHandler(async (req, res) => {
  const { title, category, description, medium, year, purchaseUrl } = req.body;
  let updateData: any = { title, category, description, medium, year, purchaseUrl };

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
  } else if (req.body.imageUrl) {
    updateData.imageUrl = req.body.imageUrl;
  }

  const sketch = await prisma.sketch.update({
    where: { id: req.params.id as string },
    data: updateData
  });
  res.json(sketch);
}));

router.delete('/sketches/:id', requireAdmin, asyncHandler(async (req, res) => {
  await prisma.sketch.delete({ where: { id: req.params.id as string } });
  res.json({ success: true });
}));

// =======================
// BOOKS (The Library)
// =======================
router.get('/books', asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
  const cursor = req.query.cursor as string | undefined;

  if (limit) {
    const books = await prisma.book.findMany({
      take: limit + 1,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor }
      }),
      orderBy: { createdAt: 'desc' }
    });
    
    let hasMore = false;
    if (books.length > limit) {
      hasMore = true;
      books.pop();
    }
    res.json({ data: books, hasMore });
  } else {
    const books = await prisma.book.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ data: books, hasMore: false });
  }
}));

router.post('/books', requireAdmin, upload.single('image'), asyncHandler(async (req, res) => {
  const { title, author, yearRead, rating, review, category, purchaseUrl } = req.body;
  let imageUrl = req.body.imageUrl || 'mock'; // Default to mock if no image provided and no file uploaded

  if (req.file) {
    let buffer = req.file.buffer;
    let contentType = req.file.mimetype;
    let fileName = req.file.originalname;

    if (contentType.startsWith('image/')) {
      buffer = await sharp(req.file.buffer)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80, progressive: true })
        .toBuffer();
      contentType = 'image/jpeg';
      fileName = fileName.replace(/\.[^/.]+$/, "") + ".jpeg";
    }

    const uniqueFileName = `${Date.now()}-${fileName.replace(/\s/g, '_')}`;
    const { error } = await supabase.storage
      .from('sketches') // Reusing the 'sketches' bucket for books cover images for simplicity
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

  const book = await prisma.book.create({ 
    data: { title, author, yearRead, rating, review, category, imageUrl, purchaseUrl }
  });
  res.status(201).json(book);
}));

router.put('/books/:id', requireAdmin, upload.single('image'), asyncHandler(async (req, res) => {
  const { title, author, yearRead, rating, review, category, purchaseUrl } = req.body;
  let updateData: any = { title, author, yearRead, rating, review, category, purchaseUrl };

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
  } else if (req.body.imageUrl) {
    updateData.imageUrl = req.body.imageUrl;
  }

  const book = await prisma.book.update({
    where: { id: req.params.id as string },
    data: updateData
  });
  res.json(book);
}));

router.delete('/books/:id', requireAdmin, asyncHandler(async (req, res) => {
  await prisma.book.delete({ where: { id: req.params.id as string } });
  res.json({ success: true });
}));

// =======================
// BLOG POSTS
// =======================
router.get('/blogs', asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
  const cursor = req.query.cursor as string | undefined;
  const category = req.query.category as string | undefined;

  let whereClause = {};
  if (category) {
    whereClause = { tag: category };
  }

  if (limit) {
    const blogs = await prisma.blogPost.findMany({
      where: whereClause,
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
  } else {
    const blogs = await prisma.blogPost.findMany({ where: whereClause, orderBy: { createdAt: 'desc' } });
    res.json({ data: blogs, hasMore: false });
  }
}));

router.post('/blogs', requireAdmin, asyncHandler(async (req, res) => {
  const blog = await prisma.blogPost.create({ data: req.body });
  res.status(201).json(blog);
}));

router.put('/blogs/:id', requireAdmin, asyncHandler(async (req, res) => {
  const blog = await prisma.blogPost.update({
    where: { id: req.params.id as string },
    data: req.body
  });
  res.json(blog);
}));

router.delete('/blogs/:id', requireAdmin, asyncHandler(async (req, res) => {
  await prisma.blogPost.delete({ where: { id: req.params.id as string } });
  res.json({ success: true });
}));

// =======================
// MESSAGES (Contact)
// =======================
router.get('/messages', requireAdmin, asyncHandler(async (req, res) => {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(messages);
}));

router.post('/messages', asyncHandler(async (req, res) => {
  const message = await prisma.message.create({ data: req.body });
  res.status(201).json(message);
}));

router.delete('/messages/:id', requireAdmin, asyncHandler(async (req, res) => {
  await prisma.message.delete({ where: { id: req.params.id as string } });
  res.json({ success: true });
}));

// =======================
// GUESTBOOK
// =======================
router.get('/guestbook', asyncHandler(async (req, res) => {
  const entries = await prisma.guestbookEntry.findMany({ 
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  res.json(entries);
}));

router.post('/guestbook', asyncHandler(async (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    res.status(400).json({ error: 'Name and message are required' });
    return;
  }
  const entry = await prisma.guestbookEntry.create({ data: { name, message } });
  res.status(201).json(entry);
}));

router.delete('/guestbook/:id', requireAdmin, asyncHandler(async (req, res) => {
  await prisma.guestbookEntry.delete({ where: { id: req.params.id as string } });
  res.json({ success: true });
}));

// =======================
// SETTINGS (Links)
// =======================
router.get('/settings', asyncHandler(async (req, res) => {
  let settings = await prisma.settings.findUnique({ where: { id: 'global' } });
  if (!settings) {
    settings = await prisma.settings.create({ data: { id: 'global' } });
  }
  res.json(settings);
}));

router.put('/settings', requireAdmin, asyncHandler(async (req, res) => {
  const settings = await prisma.settings.upsert({
    where: { id: 'global' },
    update: req.body,
    create: { id: 'global', ...req.body }
  });
  res.json(settings);
}));

// =======================
// PROJECTS (The Press Room)
// =======================
router.get('/projects', asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
  const cursor = req.query.cursor as string | undefined;

  if (limit) {
    const projects = await prisma.project.findMany({
      take: limit + 1,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor }
      }),
      orderBy: { createdAt: 'desc' }
    });
    
    let hasMore = false;
    if (projects.length > limit) {
      hasMore = true;
      projects.pop();
    }
    res.json({ data: projects, hasMore });
  } else {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ data: projects, hasMore: false });
  }
}));

router.post('/projects', requireAdmin, upload.single('image'), asyncHandler(async (req, res) => {
  const { title, subtitle, techStack, content, liveUrl, githubUrl } = req.body;
  let imageUrl = req.body.imageUrl || 'mock'; 

  if (req.file) {
    let buffer = req.file.buffer;
    let contentType = req.file.mimetype;
    let fileName = req.file.originalname;

    if (contentType.startsWith('image/')) {
      buffer = await sharp(req.file.buffer)
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

  const project = await prisma.project.create({ 
    data: { title, subtitle, techStack, content, imageUrl, liveUrl, githubUrl }
  });
  res.status(201).json(project);
}));

router.put('/projects/:id', requireAdmin, upload.single('image'), asyncHandler(async (req, res) => {
  const { title, subtitle, techStack, content, liveUrl, githubUrl } = req.body;
  let updateData: any = { title, subtitle, techStack, content, liveUrl, githubUrl };

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
  } else if (req.body.imageUrl) {
    updateData.imageUrl = req.body.imageUrl;
  }

  const project = await prisma.project.update({
    where: { id: req.params.id as string },
    data: updateData
  });
  res.json(project);
}));

router.delete('/projects/:id', requireAdmin, asyncHandler(async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id as string } });
  res.json({ success: true });
}));

export default router;
