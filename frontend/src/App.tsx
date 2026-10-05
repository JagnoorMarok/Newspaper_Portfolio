import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { SettingsProvider } from './context/SettingsContext';

const Home = lazy(() => import('./pages/Home'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Blog = lazy(() => import('./pages/Blog'));
const Books = lazy(() => import('./pages/Books'));
const PressRoom = lazy(() => import('./pages/PressRoom'));
const Classifieds = lazy(() => import('./pages/Classifieds'));
const Contact = lazy(() => import('./pages/Contact'));
const Admin = lazy(() => import('./pages/Admin'));
const NotForSale = lazy(() => import('./pages/NotForSale'));

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="blog" element={<Blog />} />
            <Route path="books" element={<Books />} />
            <Route path="press" element={<PressRoom />} />
            <Route path="classifieds" element={<Classifieds />} />
            <Route path="contact" element={<Contact />} />
            <Route path="admin" element={<Admin />} />
            <Route path="NA" element={<NotForSale />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  );
}

export default App;
