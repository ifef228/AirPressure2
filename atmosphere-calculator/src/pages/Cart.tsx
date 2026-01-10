import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Table, Form } from 'react-bootstrap';
import { useAppSelector } from '../store/hooks';
import { api } from '../api/index';
import { useCart } from '../contexts/CartContext';

const Cart: FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { cartItems, refreshCart } = useCart();
  const [cartOrder, setCartOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingGas, setEditingGas] = useState<number | null>(null);
  const [concentrationValues, setConcentrationValues] = useState<Record<number, number>>({});
  const [saving, setSaving] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadCart();
  }, [isAuthenticated, navigate]);

  const loadCart = async (forceReload: boolean = false) => {
    // Если корзина уже загружена и не требуется принудительная перезагрузка, пропускаем
    if (!forceReload && cartOrder && !loading) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Получаем информацию о корзине
      const cartIcon = await api.cart.getCartIcon();
      if (cartIcon.orderId) {
        // Загружаем заявку корзины
        const order = await api.orders.getOrderById(cartIcon.orderId);
        setCartOrder(order);
        // Инициализируем значения концентрации
        const initialValues: Record<number, number> = {};
        if (order.gases) {
          order.gases.forEach((gas: any) => {
            initialValues[gas.id] = gas.concentration;
          });
        }
        setConcentrationValues(initialValues);
      } else {
        setCartOrder(null);
      }
    } catch (err: any) {
      console.error('Ошибка при загрузке корзины:', err);
      setError(err.message || 'Ошибка загрузки корзины');
      setCartOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (gasId: number) => {
    if (!cartOrder) return;

    try {
      await api.cart.removeFromCart(gasId);
      // Обновляем локальное состояние вместо полной перезагрузки
      setCartOrder((prevOrder: any) => {
        if (!prevOrder || !prevOrder.gases) return prevOrder;
        const updatedGases = prevOrder.gases.filter((gas: any) => gas.gasId !== gasId);
        return {
          ...prevOrder,
          gases: updatedGases
        };
      });
      // Обновляем корзину в контексте (только список gasId, без запроса к cart-icon)
      // НЕ вызываем loadCart(), чтобы не создавать новую корзину на бэкенде
      await refreshCart();
    } catch (err) {
      console.error('Ошибка при удалении из корзины:', err);
    }
  };

  const handleEditConcentration = (gasId: number, gasOrderId: number) => {
    setEditingGas(gasOrderId);
  };

  const handleSaveConcentration = async (gasId: number, gasOrderId: number) => {
    if (!cartOrder) return;

    const newConcentration = concentrationValues[gasOrderId];
    if (newConcentration === undefined || newConcentration < 0 || newConcentration > 100) {
      alert('Концентрация должна быть от 0 до 100%');
      return;
    }

    setSaving(prev => ({ ...prev, [gasOrderId]: true }));
    try {
      await api.orders.updateGasInOrder(cartOrder.id, gasId, {
        concentration: newConcentration
      });
      setEditingGas(null);
      // Обновляем локальное состояние вместо полной перезагрузки
      setCartOrder((prevOrder: any) => {
        if (!prevOrder || !prevOrder.gases) return prevOrder;
        return {
          ...prevOrder,
          gases: prevOrder.gases.map((gas: any) =>
            gas.id === gasOrderId
              ? { ...gas, concentration: newConcentration }
              : gas
          )
        };
      });
      // НЕ вызываем refreshCart() или loadCart(), чтобы не создавать новую корзину на бэкенде
    } catch (err: any) {
      console.error('Ошибка при сохранении концентрации:', err);
      alert(err.message || 'Ошибка при сохранении концентрации');
      // Восстанавливаем исходное значение при ошибке
      if (cartOrder && cartOrder.gases) {
        const gas = cartOrder.gases.find((g: any) => g.id === gasOrderId);
        if (gas) {
          setConcentrationValues(prev => ({
            ...prev,
            [gasOrderId]: gas.concentration
          }));
        }
      }
    } finally {
      setSaving(prev => ({ ...prev, [gasOrderId]: false }));
    }
  };

  const handleCancelEdit = (gasOrderId: number) => {
    setEditingGas(null);
    // Восстанавливаем исходное значение
    if (cartOrder && cartOrder.gases) {
      const gas = cartOrder.gases.find((g: any) => g.id === gasOrderId);
      if (gas) {
        setConcentrationValues(prev => ({
          ...prev,
          [gasOrderId]: gas.concentration
        }));
      }
    }
  };

  const handleSubmitOrder = async () => {
    if (!cartOrder) return;
    try {
      await api.orders.formOrder(cartOrder.id);
      navigate('/orders');
    } catch (err: any) {
      console.error('Ошибка при подтверждении заявки:', err);
      alert(err.message || 'Ошибка при подтверждении заявки');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
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

  if (error) {
    return (
      <Container className="py-5">
        <Row>
          <Col>
            <Alert variant="danger">{error}</Alert>
            <Button onClick={() => navigate('/gases')}>Перейти к услугам</Button>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!cartOrder || !cartOrder.gases || cartOrder.gases.length === 0) {
    return (
      <Container className="py-4">
        <Row className="my-4">
          <Col>
            <h1 style={{ fontWeight: '700', color: '#000' }}>Корзина</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <Alert variant="info">
              <h5>Корзина пуста</h5>
              <p>Добавьте услуги в корзину, чтобы продолжить.</p>
              <Button
                variant="primary"
                onClick={() => navigate('/gases')}
                style={{ backgroundColor: '#FCE000', color: '#000', border: 'none', fontWeight: '600' }}
              >
                Перейти к услугам
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="my-4">
        <Col>
          <h1 style={{ fontWeight: '700', color: '#000' }}>Корзина</h1>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Состав заявки</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Газ</th>
                      <th>Формула</th>
                      <th>Концентрация</th>
                      <th>Температура</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartOrder.gases.map((gas: any) => (
                      <tr key={gas.id}>
                        <td>
                          <strong>{gas.gasName}</strong>
                        </td>
                        <td>{gas.gasFormula}</td>
                        <td>
                          {editingGas === gas.id ? (
                            <div className="d-flex align-items-center gap-2">
                              <Form.Control
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={concentrationValues[gas.id] ?? gas.concentration}
                                onChange={(e) => setConcentrationValues(prev => ({
                                  ...prev,
                                  [gas.id]: parseFloat(e.target.value) || 0
                                }))}
                                style={{ width: '100px' }}
                                disabled={saving[gas.id]}
                              />
                              <span>%</span>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleSaveConcentration(gas.gasId, gas.id)}
                                disabled={saving[gas.id]}
                              >
                                {saving[gas.id] ? (
                                  <Spinner animation="border" size="sm" />
                                ) : (
                                  '✓'
                                )}
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handleCancelEdit(gas.id)}
                                disabled={saving[gas.id]}
                              >
                                ✕
                              </Button>
                            </div>
                          ) : (
                            <div className="d-flex align-items-center gap-2">
                              <span>{gas.concentration}%</span>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEditConcentration(gas.gasId, gas.id)}
                              >
                                Изменить
                              </Button>
                            </div>
                          )}
                        </td>
                        <td>{gas.temperature}°C</td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveFromCart(gas.gasId)}
                          >
                            Удалить
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="mt-3 d-flex gap-2">
                <Button
                  variant="primary"
                  onClick={handleSubmitOrder}
                  style={{ backgroundColor: '#FCE000', color: '#000', border: 'none', fontWeight: '600' }}
                >
                  Подтвердить заявку
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate('/gases')}
                >
                  Продолжить покупки
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
