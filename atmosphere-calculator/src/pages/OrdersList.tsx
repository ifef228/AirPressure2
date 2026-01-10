import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOrders } from '../store/ordersSlice';
import { Order } from '../api/index';

const OrdersList: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.orders);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(fetchOrders());
  }, [dispatch, isAuthenticated, navigate]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: string; text: string }> = {
      DRAFT: { variant: 'secondary', text: 'Черновик' },
      FORMED: { variant: 'warning', text: 'Сформирована' },
      COMPLETED: { variant: 'success', text: 'Завершена' },
      CANCELLED: { variant: 'danger', text: 'Отменена' },
      DELETED: { variant: 'dark', text: 'Удалена' },
    };

    const statusInfo = statusMap[status] || { variant: 'secondary', text: status };
    return (
      <span className={`badge bg-${statusInfo.variant}`}>
        {statusInfo.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container className="py-4">
      <Row className="my-4">
        <Col>
          <h1 style={{ fontWeight: '700', color: '#000' }}>
            Мои заявки
          </h1>
        </Col>
      </Row>

      {error && (
        <Row className="my-3">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {loading ? (
        <Row className="my-5">
          <Col className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </Spinner>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            {orders.length === 0 ? (
              <Alert variant="info">
                <h5>Нет заявок</h5>
                <p>У вас пока нет заявок. Создайте первую заявку на странице услуг.</p>
              </Alert>
            ) : (
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Газ</th>
                      <th>Температура</th>
                      <th>Давление</th>
                      <th>Статус</th>
                      <th>Дата создания</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order: Order) => {
                      // Получаем первый газ из массива gases для отображения
                      const firstGas = order.gases && order.gases.length > 0 ? order.gases[0] : null;
                      const displayGas = order.gas || (firstGas ? {
                        id: firstGas.gasId,
                        name: firstGas.gasName,
                        formula: firstGas.gasFormula
                      } : null);
                      const displayTemperature = order.temperature ?? firstGas?.temperature ?? 0;
                      const displayPressure = order.pressure ?? 0;
                      const displayDate = order.createdAt || order.timestamp || '';

                      return (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>
                            {displayGas ? (
                              <>
                                <strong>{displayGas.name}</strong>
                                <br />
                                <small className="text-muted">{displayGas.formula}</small>
                                {order.gases && order.gases.length > 1 && (
                                  <>
                                    <br />
                                    <small className="text-muted">+{order.gases.length - 1} еще</small>
                                  </>
                                )}
                              </>
                            ) : (
                              order.gasId ? `Газ #${order.gasId}` : 'Нет газов'
                            )}
                          </td>
                          <td>{displayTemperature}°C</td>
                          <td>{displayPressure} Па</td>
                          <td>{getStatusBadge(order.status)}</td>
                          <td>{displayDate ? formatDate(displayDate) : 'Не указано'}</td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => navigate(`/orders/${order.id}`)}
                            >
                              Подробнее
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default OrdersList;
