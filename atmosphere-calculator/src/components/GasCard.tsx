import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Gas } from '../types';

interface GasCardProps {
  gas: Gas;
}

// Дефолтное изображение для газов (SVG)
const DEFAULT_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e9ecef' width='200' height='200'/%3E%3Ctext fill='%236c757d' font-family='Arial' font-size='24' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3E⚛️ Газ%3C/text%3E%3C/svg%3E`;

const GasCard: FC<GasCardProps> = ({ gas }) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const imageUrl = gas.imageUrl || DEFAULT_IMAGE;
  const inCart = isInCart(gas.id);

  const handleCardClick = () => {
    navigate(`/gases/${gas.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inCart) {
      addToCart(gas.id);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '250px',
        height: 'auto',
        background: '#ffffff',
        border: '1px solid #e6e6e6',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        padding: '1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '1rem',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Изображение слева */}
      <div style={{ flexShrink: 0, flexBasis: 'auto' }}>
        <img
          src={imageUrl}
          alt={gas.name}
          style={{
            width: '100px',
            height: '100px',
            objectFit: 'cover',
            borderRadius: '8px',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
          }}
        />
      </div>

      {/* Контент по центру */}
      <div style={{
        flex: '1 1 auto',
        minWidth: '150px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '0.5rem'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#000', margin: 0, lineHeight: '1.2' }}>
          {gas.name}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>
            <span style={{ fontWeight: '500' }}>Концентрация:</span>{' '}
            <span>{gas.concentration || '0.04%'}</span>
          </p>
          <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>
            <span style={{ fontWeight: '500' }}>Температура:</span>{' '}
            <span>{gas.temperature || '15°C'}</span>
          </p>
        </div>
      </div>

      {/* Кнопка "в корзину" справа */}
      <div style={{
        flexShrink: 0,
        flexBasis: 'auto',
        display: 'flex',
        alignItems: 'center',
        marginLeft: 'auto'
      }}>
        <button
          onClick={handleAddToCart}
          style={{
            width: '140px',
            height: '55px',
            background: inCart ? '#cccccc' : '#FCE000',
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '500',
            fontSize: '0.95rem',
            cursor: inCart ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: inCart ? 0.75 : 1,
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            if (!inCart) {
              e.currentTarget.style.background = '#E6CA00';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!inCart) {
              e.currentTarget.style.background = '#FCE000';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {inCart ? 'в корзине' : 'в корзину'}
        </button>
      </div>
    </div>
  );
};

export default GasCard;
