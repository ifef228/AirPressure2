import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form, Table } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOrderById, updateOrder, submitOrder, setCurrentOrder } from '../store/ordersSlice';
import { Order, api } from '../api/index';

const OrderDetail: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentOrder, loading, error } = useAppSelector((state) => state.orders);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [temperature, setTemperature] = useState<number>(0);
  const [pressure, setPressure] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [editingGas, setEditingGas] = useState<number | null>(null);
  const [concentrationValues, setConcentrationValues] = useState<Record<number, number>>({});
  const [saving, setSaving] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (id) {
      dispatch(fetchOrderById(Number(id)));
    }
  }, [dispatch, id, isAuthenticated, navigate]);

  useEffect(() => {
    if (currentOrder) {
      setTemperature(currentOrder.temperature ?? 0);
      setPressure(currentOrder.pressure ?? 0);
      // Инициализируем значения концентрации
      const initialValues: Record<number, number> = {};
      if (currentOrder.gases) {
        currentOrder.gases.forEach((gas: any) => {
          initialValues[gas.id] = gas.concentration;
        });
      }
      setConcentrationValues(initialValues);
    }
  }, [currentOrder]);

  const isDraft = currentOrder?.status === 'DRAFT';

  const handleSave = async () => {
    if (!id || !currentOrder) return;
    setSubmitting(true);
    try {
      await dispatch(updateOrder({
        id: Number(id),
        data: { temperature, pressure },
      })).unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!id) return;
    setSubmitting(true);
    try {
      await dispatch(submitOrder(Number(id))).unwrap();
      navigate('/orders');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditConcentration = (gasId: number, gasOrderId: number) => {
    setEditingGas(gasOrderId);
  };

  const handleSaveConcentration = async (gasId: number, gasOrderId: number) => {
    if (!id || !currentOrder) return;

    const newConcentration = concentrationValues[gasOrderId];
    if (newConcentration === undefined || newConcentration < 0 || newConcentration > 100) {
      alert('Концентрация должна быть от 0 до 100%');
      return;
    }

    setSaving(prev => ({ ...prev, [gasOrderId]: true }));
    try {
      await api.orders.updateGasInOrder(Number(id), gasId, {
        concentration: newConcentration
      });
      setEditingGas(null);
      // Обновляем локальное состояние вместо полной перезагрузки
      if (currentOrder.gases) {
        const updatedGases = currentOrder.gases.map((gas: any) =>
          gas.id === gasOrderId
            ? { ...gas, concentration: newConcentration }
            : gas
        );
        // Обновляем через dispatch, но без полной перезагрузки с сервера
        // Это предотвратит создание новой корзины на бэкенде
        dispatch(setCurrentOrder({
          ...currentOrder,
          gases: updatedGases
        }));
      }
    } catch (err: any) {
      console.error('Ошибка при сохранении концентрации:', err);
      alert(err.message || 'Ошибка при сохранении концентрации');
      // Восстанавливаем исходное значение при ошибке
      if (currentOrder && currentOrder.gases) {
        const gas = currentOrder.gases.find((g: any) => g.id === gasOrderId);
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
    if (currentOrder && currentOrder.gases) {
      const gas = currentOrder.gases.find((g: any) => g.id === gasOrderId);
      if (gas) {
        setConcentrationValues(prev => ({
          ...prev,
          [gasOrderId]: gas.concentration
        }));
      }
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

  if (error || !currentOrder) {
    return (
      <Container className="py-5">
        <Row>
          <Col>
            <Alert variant="danger">
              {error || 'Заявка не найдена'}
            </Alert>
            <Button onClick={() => navigate('/orders')}>Вернуться к списку заявок</Button>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="my-4">
        <Col>
          <Button
            variant="outline-secondary"
            onClick={() => navigate('/orders')}
            className="mb-3"
          >
            ← Назад к списку заявок
          </Button>
          <h1 style={{ fontWeight: '700', color: '#000' }}>
            Заявка #{currentOrder.id}
          </h1>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Информация о заявке</h5>
            </Card.Header>
            <Card.Body>
              {currentOrder.gases && currentOrder.gases.length > 0 ? (
                <div className="mb-3">
                  <h6 className="mb-3">Газы в заявке:</h6>
                  <div className="table-responsive">
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Газ</th>
                          <th>Формула</th>
                          <th>Концентрация</th>
                          <th>Температура</th>
                          {isDraft && <th>Действия</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {currentOrder.gases.map((gas: any) => (
                          <tr key={gas.id}>
                            <td><strong>{gas.gasName}</strong></td>
                            <td>{gas.gasFormula}</td>
                            <td>
                              {isDraft && editingGas === gas.id ? (
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
                                  {isDraft && (
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      onClick={() => handleEditConcentration(gas.gasId, gas.id)}
                                    >
                                      Изменить
                                    </Button>
                                  )}
                                </div>
                              )}
                            </td>
                            <td>{gas.temperature}°C</td>
                            {isDraft && (
                              <td>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={async () => {
                                    if (window.confirm('Удалить газ из заявки?')) {
                                      try {
                                        await api.orders.removeGasFromOrder(Number(id), gas.gasId);
                                        await dispatch(fetchOrderById(Number(id)));
                                      } catch (err: any) {
                                        console.error('Ошибка при удалении:', err);
                                        alert(err.message || 'Ошибка при удалении газа');
                                      }
                                    }
                                  }}
                                >
                                  Удалить
                                </Button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              ) : (
                <Row className="mb-3">
                  <Col>
                    <strong>Газ:</strong>{' '}
                    {currentOrder.gas ? (
                      <>
                        {currentOrder.gas.name} ({currentOrder.gas.formula})
                      </>
                    ) : (
                      `Газ #${currentOrder.gasId || 'не указан'}`
                    )}
                  </Col>
                </Row>
              )}

              {isDraft ? (
                <>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Температура (°C)</Form.Label>
                        <Form.Control
                          type="number"
                          value={temperature}
                          onChange={(e) => setTemperature(Number(e.target.value))}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Давление (Па)</Form.Label>
                        <Form.Control
                          type="number"
                          value={pressure}
                          onChange={(e) => setPressure(Number(e.target.value))}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex gap-2">
                    <Button
                      variant="primary"
                      onClick={handleSave}
                      disabled={submitting}
                      style={{ backgroundColor: '#FCE000', color: '#000', border: 'none', fontWeight: '600' }}
                    >
                      {submitting ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Сохранение...
                        </>
                      ) : (
                        'Сохранить изменения'
                      )}
                    </Button>
                    <Button
                      variant="success"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Отправка...
                        </>
                      ) : (
                        'Подтвердить заявку'
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Row className="mb-3">
                    <Col>
                      <strong>Температура:</strong> {currentOrder.temperature}°C
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <strong>Давление:</strong> {currentOrder.pressure} Па
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <strong>Статус:</strong>{' '}
                      <span className={`badge bg-${
                        currentOrder.status === 'COMPLETED' ? 'success' :
                        currentOrder.status === 'FORMED' ? 'warning' :
                        currentOrder.status === 'CANCELLED' ? 'danger' :
                        currentOrder.status === 'DELETED' ? 'dark' : 'secondary'
                      }`}>
                        {currentOrder.status === 'DRAFT' ? 'Черновик' :
                         currentOrder.status === 'FORMED' ? 'Сформирована' :
                         currentOrder.status === 'COMPLETED' ? 'Завершена' :
                         currentOrder.status === 'CANCELLED' ? 'Отменена' :
                         currentOrder.status === 'DELETED' ? 'Удалена' : currentOrder.status}
                      </span>
                    </Col>
                  </Row>
                </>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Дополнительная информация</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-2">
                <Col>
                  <strong>Дата создания:</strong>{' '}
                  {currentOrder.createdAt
                    ? new Date(currentOrder.createdAt).toLocaleString('ru-RU')
                    : currentOrder.timestamp
                      ? new Date(currentOrder.timestamp).toLocaleString('ru-RU')
                      : 'Не указано'}
                </Col>
              </Row>
              <Row>
                <Col>
                  <strong>Последнее обновление:</strong>{' '}
                  {currentOrder.updatedAt
                    ? new Date(currentOrder.updatedAt).toLocaleString('ru-RU')
                    : currentOrder.timestamp
                      ? new Date(currentOrder.timestamp).toLocaleString('ru-RU')
                      : 'Не указано'}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetail;
