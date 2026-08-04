"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient({ adapter });
const PORT = process.env.PORT || 3001;
const routes_1 = __importDefault(require("./routes"));
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express_1.default.json());
app.use('/api', routes_1.default);
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
