import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getProfile, updateProfile, clearError } from '../store/authSlice';

const Profile: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!user) {
      dispatch(getProfile());
    } else {
      setFormData({
        email: user.email || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [dispatch, isAuthenticated, navigate, user]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (formData.password && formData.password.length < 6) {
      setValidationError('Пароль должен содержать минимум 6 символов');
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setValidationError('Пароли не совпадают');
      return;
    }

    setUpdating(true);
    try {
      const updateData: { email?: string; password?: string } = {};
      if (formData.email !== user?.email) {
        updateData.email = formData.email;
      }
      if (formData.password) {
        updateData.password = formData.password;
      }
      await dispatch(updateProfile(updateData)).unwrap();
      setFormData({
        ...formData,
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading && !user) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </Spinner>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="my-4">
        <Col>
          <h1 style={{ fontWeight: '700', color: '#000' }}>
            Личный кабинет
          </h1>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Профиль пользователя</h5>
            </Card.Header>
            <Card.Body>
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
                    value={user?.login || ''}
                    disabled
                    style={{ backgroundColor: '#f8f9fa' }}
                  />
                  <Form.Text className="text-muted">
                    Логин нельзя изменить
                  </Form.Text>
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
                  <Form.Label>Новый пароль (оставьте пустым, чтобы не менять)</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Введите новый пароль"
                  />
                </Form.Group>

                {formData.password && (
                  <Form.Group className="mb-3">
                    <Form.Label>Подтверждение нового пароля</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Подтвердите новый пароль"
                    />
                  </Form.Group>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  disabled={updating}
                  style={{ backgroundColor: '#FCE000', color: '#000', border: 'none', fontWeight: '600' }}
                >
                  {updating ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Сохранение...
                    </>
                  ) : (
                    'Сохранить изменения'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {user && (
            <Card className="mt-4">
              <Card.Header>
                <h5 className="mb-0">Дополнительная информация</h5>
              </Card.Header>
              <Card.Body>
                <Row className="mb-2">
                  <Col>
                    <strong>Роль:</strong> {user.role || 'Пользователь'}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <strong>Дата регистрации:</strong>{' '}
                    {user.createdAt ? new Date(user.createdAt).toLocaleString('ru-RU') : 'Не указана'}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
