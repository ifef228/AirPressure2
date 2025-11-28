import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAppSelector } from '../store/hooks';

const FloatingCart: FC = () => {
  const navigate = useNavigate();
  const { getCartItemsCount } = useCart();
  const cartCount = getCartItemsCount();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleCartClick = () => {
    if (cartCount > 0 && isAuthenticated) {
      navigate('/cart');
    }
  };

  // Стили из старого дизайна
  const cartBaseStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease',
    zIndex: 1000,
  };

  const cartActiveStyle: React.CSSProperties = {
    ...cartBaseStyle,
    background: '#FCE000',
    color: '#000',
    cursor: 'pointer',
  };

  const cartEmptyStyle: React.CSSProperties = {
    ...cartBaseStyle,
    background: '#cccccc',
    color: '#666',
    cursor: 'not-allowed',
  };

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    width: '24px',
    height: '24px',
    background: '#ef4444',
    color: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    animation: cartCount > 0 ? 'pulse 2s infinite' : 'none',
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Корзина */}
      <div
        onClick={handleCartClick}
        onMouseEnter={(e) => {
          if (cartCount > 0 && isAuthenticated) {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.background = '#E6CA00';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          if (cartCount > 0 && isAuthenticated) {
            e.currentTarget.style.background = '#FCE000';
          }
        }}
        style={cartCount > 0 && isAuthenticated ? cartActiveStyle : cartEmptyStyle}
        title={
          !isAuthenticated
            ? 'Войдите, чтобы использовать корзину'
            : cartCount === 0
              ? 'Корзина пуста'
              : 'Перейти к корзине'
        }
      >
        🛒
        {/* Badge с количеством - внутри элемента корзины */}
        {cartCount > 0 && (
          <div style={badgeStyle}>
            {cartCount}
          </div>
        )}
      </div>

      {/* CSS анимация pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingCart;
