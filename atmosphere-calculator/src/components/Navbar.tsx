import { FC, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar as BSNavbar, Container, Nav } from 'react-bootstrap';

// Типы цветов светофора
type TrafficLightColor = 'red' | 'yellow' | 'green';

const Navbar: FC = () => {
  const location = useLocation();

  // useState для мини-игры Светофор
  const [trafficLight, setTrafficLight] = useState<TrafficLightColor>('red');

  // Функция переключения цвета светофора
  const switchTrafficLight = () => {
    setTrafficLight((current) => {
      switch (current) {
        case 'red':
          return 'yellow';
        case 'yellow':
          return 'green';
        case 'green':
          return 'red';
        default:
          return 'red';
      }
    });
  };

  // Цвета для светофора
  const lightColors = {
    red: '#dc3545',
    yellow: '#ffc107',
    green: '#28a745',
  };

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg" className="mb-0" style={{ backgroundColor: '#ffffff' }}>
      <Container>
        <BSNavbar.Brand as={Link} to="/" style={{ fontSize: '1.5rem', fontWeight: '700' }}>
          🌡️ AtmosphericTempCalc
        </BSNavbar.Brand>

        {/* Мини-игра: Светофор */}
        <div
          onClick={switchTrafficLight}
          style={{
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            backgroundColor: '#333',
            borderRadius: '8px',
            border: '2px solid #555',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title={`Светофор: ${trafficLight === 'red' ? 'Красный' : trafficLight === 'yellow' ? 'Желтый' : 'Зеленый'}. Кликните чтобы переключить!`}
        >
          {/* Красный свет */}
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: trafficLight === 'red' ? lightColors.red : '#444',
              border: `2px solid ${trafficLight === 'red' ? lightColors.red : '#666'}`,
              transition: 'all 0.3s ease',
              boxShadow: trafficLight === 'red' ? `0 0 10px ${lightColors.red}, 0 0 20px ${lightColors.red}` : 'none',
            }}
          />

          {/* Желтый свет */}
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: trafficLight === 'yellow' ? lightColors.yellow : '#444',
              border: `2px solid ${trafficLight === 'yellow' ? lightColors.yellow : '#666'}`,
              transition: 'all 0.3s ease',
              boxShadow: trafficLight === 'yellow' ? `0 0 10px ${lightColors.yellow}, 0 0 20px ${lightColors.yellow}` : 'none',
            }}
          />

          {/* Зеленый свет */}
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: trafficLight === 'green' ? lightColors.green : '#444',
              border: `2px solid ${trafficLight === 'green' ? lightColors.green : '#666'}`,
              transition: 'all 0.3s ease',
              boxShadow: trafficLight === 'green' ? `0 0 10px ${lightColors.green}, 0 0 20px ${lightColors.green}` : 'none',
            }}
          />
        </div>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/"
              active={location.pathname === '/'}
            >
              Главная
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/gases"
              active={location.pathname === '/gases'}
            >
              Услуги (Газы)
            </Nav.Link>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
