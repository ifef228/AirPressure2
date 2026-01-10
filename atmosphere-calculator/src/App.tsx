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
  // Для локальной разработки (localhost) используем пустой basename
  // Для production (GitHub Pages) используем '/AirPressure2'
  const isTauri = !!(window as any).__TAURI__;
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const basename = isTauri ? '' : (isLocalhost ? '' : '/AirPressure2');

  // Логирование только в dev режиме
  if (import.meta.env.DEV) {
    console.log('[App] Rendering App component');
    console.log('[App] Environment:', { isTauri, isLocalhost, basename, hostname: window.location.hostname });
  }

  return (
    <CartProvider>
      <Router basename={basename}>
        <div className="d-flex flex-column min-vh-100" style={{ minHeight: '100vh', backgroundColor: '#f8f8f8', width: '100%' }}>
          <Navbar />
          <Breadcrumbs />

          <main className="flex-grow-1" style={{ width: '100%', flex: 1 }}>
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

          <footer className="bg-dark py-4 mt-auto" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e6e6e6', width: '100%' }}>
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
