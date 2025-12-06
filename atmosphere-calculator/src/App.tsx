import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Breadcrumbs from './components/Breadcrumbs';
import FloatingCart from './components/FloatingCart';
import Home from './pages/Home';
import GasesList from './pages/GasesList';
import GasDetail from './pages/GasDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import OrdersList from './pages/OrdersList';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import Cart from './pages/Cart';

const App: FC = () => {
  // Определяем basename в зависимости от окружения
  // Для Tauri (window.__TAURI__) используем пустой basename
  // Для веб-версии (GitHub Pages) используем '/AirPressure2'
  const basename = (window as any).__TAURI__ ? '' : '/AirPressure2';

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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/orders" element={<OrdersList />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
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
