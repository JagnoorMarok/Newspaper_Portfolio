# The Marok Gazette

A unique, interactive personal developer portfolio styled as a classic vintage newspaper. *The Marok Gazette* breaks away from traditional portfolio layouts, offering visitors a curated, editorial experience full of charm, responsive design, and delightful micro-interactions.

## 🗞️ Features & Sections

- **The Front Page (Home):** A dynamic hero layout featuring the latest "headlines," a daily weather report, and an interactive Guestbook drawer.
- **The Sketchbook (Gallery):** A categorized gallery with modal image viewing, grayscale-to-color hover effects, and masonry-style layout.
- **The Bulletin (Blog):** Personal dispatches and articles rendered with classic serif typography.
- **The Press Room (Projects):** A text-driven showcase of past work, featuring technologies used, external links, and detailed stories.
- **The Library (Books):** A curated, paginated reading list of technical, philosophical, and fictional literature.
- **Classifieds:** A playful section for services, seeking notices, and public announcements.
- **The Dispatch (Contact):** A classic correspondence form for inquiries.
- **Editor's Dashboard (Admin):** A secure, fully-functional backend panel to seamlessly publish, edit, and delete content across all sections directly from the UI.

### ✨ Easter Eggs & Details
- **Coffee Stains:** Interactive coffee rings scattered across the site that reveal secret messages when clicked.
- **Day/Night Edition:** A seamless Light/Dark mode toggle simulating the transition between fresh ink and aged paper.
- **Live Masthead:** The navigation bar calculates the current volume/issue based on the day of the year and fetches real-time weather data.

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- TypeScript
- Tailwind CSS (Custom vintage aesthetic with CSS variables)
- Framer Motion (Page transitions & micro-animations)
- React Router DOM
- Lucide React (Icons)

**Backend:**
- Node.js & Express
- Prisma ORM
- Supabase (PostgreSQL Database & Cloud Storage for image uploads)
- Multer & Sharp (Image processing and optimization)
- JWT (Authentication for the Editor's Dashboard)

## 🚀 Local Development Setup

To run *The Marok Gazette* locally, you'll need Node.js installed on your machine and a Supabase account for the database.

### 1. Clone the Repository
```bash
git clone https://github.com/JagnoorMarok/Newspaper_Portfolio.git
cd Newspaper_Portfolio
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=3000
DATABASE_URL="your_supabase_postgresql_connection_string"
SUPABASE_URL="your_supabase_project_url"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
ADMIN_PASSWORD="your_secure_admin_password"
JWT_SECRET="your_jwt_secret"
```
Initialize the database schema:
```bash
npx prisma db push
npx prisma generate
```
Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
```
Start the Vite development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to view the newspaper. To access the Editor's Dashboard, navigate to `/admin` and log in with your configured `ADMIN_PASSWORD`.

## 📜 License

Designed and developed by Jagnoor Marok. All rights reserved.
