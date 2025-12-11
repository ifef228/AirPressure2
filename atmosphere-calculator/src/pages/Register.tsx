import { FC, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerUser, loginUser, clearError } from '../store/authSlice';

const Register: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Пароли не совпадают');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Пароль должен содержать минимум 6 символов');
      return;
    }

    const registerResult = await dispatch(registerUser({
      login: formData.username, // Отправляем как login для соответствия бэкенду
      email: formData.email,
      password: formData.password,
    }));

    // Если регистрация успешна, автоматически входим
    if (registerUser.fulfilled.match(registerResult)) {
      await dispatch(loginUser({
        login: formData.username, // Отправляем как login для соответствия бэкенду
        password: formData.password,
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <div className="bg-light p-4 rounded shadow-sm">
            <h2 className="mb-4 text-center" style={{ fontWeight: '700', color: '#000' }}>
              Регистрация
            </h2>

            {(error || validationError) && (
              <Alert variant="danger" dismissible onClose={() => { dispatch(clearError()); setValidationError(null); }}>
                {error || validationError}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Логин</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Введите логин"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Введите email"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Пароль</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Введите пароль (минимум 6 символов)"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Подтверждение пароля</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Подтвердите пароль"
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="w-100 mb-3"
                disabled={loading}
                style={{ backgroundColor: '#FCE000', color: '#000', border: 'none', fontWeight: '600' }}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Регистрация...
                  </>
                ) : (
                  'Зарегистрироваться'
                )}
              </Button>
            </Form>

            <div className="text-center">
              <p className="mb-0" style={{ color: '#666' }}>
                Уже есть аккаунт?{' '}
                <Link to="/login" style={{ color: '#FCE000', textDecoration: 'none', fontWeight: '600' }}>
                  Войти
                </Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
