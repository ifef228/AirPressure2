import { FC, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Container, Nav, Button } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';
import { clearDraft } from '../store/draftSlice';
import { resetFilters } from '../store/filtersSlice';

// Типы цветов светофора
type TrafficLightColor = 'red' | 'yellow' | 'green';

const Navbar: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { draftOrder } = useAppSelector((state) => state.orders);

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

  // Обработчик выхода
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearDraft());
    dispatch(resetFilters());
    navigate('/');
  };

  // Обработчик перехода к заявке
  const handleOrderClick = () => {
    if (draftOrder) {
      navigate(`/orders/${draftOrder.id}`);
    }
  };

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg" className="mb-0 navbar-custom" style={{ backgroundColor: '#ffffff' }}>
      <Container fluid className="px-2 px-md-3">
        <BSNavbar.Brand
          as={Link}
          to="/"
          className="navbar-brand-responsive"
          style={{ fontSize: '1.5rem', fontWeight: '700', flexShrink: 0 }}
        >
          🌡️ <span className="d-none d-sm-inline">AtmosphericTempCalc</span>
          <span className="d-sm-none">ATC</span>
        </BSNavbar.Brand>

        {/* Мини-игра: Светофор - только на десктопе */}
        <div
          onClick={switchTrafficLight}
          className="traffic-light-responsive d-none d-lg-flex"
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
            flexShrink: 0,
            marginLeft: 'auto',
            marginRight: '1rem',
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
            className="traffic-light-dot"
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
            className="traffic-light-dot"
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
            className="traffic-light-dot"
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

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler-custom" />

        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link
              as={Link}
              to="/"
              active={location.pathname === '/'}
              className="nav-link-responsive"
            >
              Главная
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/gases"
              active={location.pathname === '/gases'}
              className="nav-link-responsive"
            >
              Услуги (Газы)
            </Nav.Link>

            {isAuthenticated ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/orders"
                  active={location.pathname === '/orders'}
                  className="nav-link-responsive"
                >
                  Мои заявки
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/profile"
                  active={location.pathname === '/profile'}
                  className="nav-link-responsive"
                >
                  Профиль
                </Nav.Link>
                {draftOrder && (
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={handleOrderClick}
                    className="ms-2"
                    style={{ backgroundColor: '#FCE000', color: '#000', border: 'none', fontWeight: '600' }}
                  >
                    Заявка ({draftOrder.id})
                  </Button>
                )}
                <Nav.Link className="nav-link-responsive">
                  <span style={{ color: '#000', fontWeight: '600' }}>
                    {user?.login || 'Пользователь'}
                  </span>
                </Nav.Link>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleLogout}
                  className="ms-2"
                >
                  Выход
                </Button>
              </>
            ) : (
              <Nav.Link
                as={Link}
                to="/login"
                active={location.pathname === '/login'}
                className="nav-link-responsive"
              >
                Вход
              </Nav.Link>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
