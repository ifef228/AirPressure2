import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Breadcrumbs from './components/Breadcrumbs';
import FloatingCart from './components/FloatingCart';
import Home from './pages/Home';
import GasesList from './pages/GasesList';
import GasDetail from './pages/GasDetail';

const App: FC = () => {
  // Всегда используем один basename
  const basename = '/airPressure';

  return (
    <CartProvider>
      <Router basename={basename}>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <Breadcrumbs />

        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gases" element={<GasesList />} />
            <Route path="/gases/:id" element={<GasDetail />} />
          </Routes>
        </main>

        <footer className="bg-dark py-4 mt-auto" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e6e6e6' }}>
          <div className="container text-center">
            <p className="mb-0" style={{ color: '#666' }}>
              © 2024 AtmosphericTempCalc | Калькулятор температуры атмосферы
            </p>
          </div>
        </footer>

        {/* Плавающая корзина (как в старом дизайне) */}
        <FloatingCart />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
