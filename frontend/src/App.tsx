import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import NotForSale from './pages/NotForSale';
import Books from './pages/Books';
import Classifieds from './pages/Classifieds';
import PressRoom from './pages/PressRoom';

function App() {
  return (
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
  );
}

export default App;
