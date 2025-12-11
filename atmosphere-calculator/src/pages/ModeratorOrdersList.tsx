import { FC, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Table, Button, Spinner, Alert, Form, Badge } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { api, Order } from '../api/index';

const ModeratorOrdersList: FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [polling, setPolling] = useState(true);

  // Фильтры
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [creatorFilter, setCreatorFilter] = useState<string>('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  // Проверка роли администратора
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'ADMIN') {
      navigate('/orders');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Функция загрузки заявок
  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Формируем даты для фильтрации (только дата, без времени)
      const formedDateFrom = dateFrom ? `${dateFrom}T00:00:00` : undefined;
      const formedDateTo = dateTo ? `${dateTo}T23:59:59` : undefined;

      const response = await api.orders.getOrdersWithFilters({
        status: statusFilter || undefined,
        formedDateFrom,
        formedDateTo,
        page,
        size: pageSize,
      });

      let filteredOrders = response.items;

      // Фильтрация по создателю на фронтенде
      if (creatorFilter) {
        filteredOrders = filteredOrders.filter(order =>
          order.creatorLogin?.toLowerCase().includes(creatorFilter.toLowerCase())
        );
      }

      setOrders(filteredOrders);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка загрузки заявок');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, statusFilter, dateFrom, dateTo, creatorFilter, page]);

  // Short polling - обновление каждые 3 секунды
  useEffect(() => {
    if (!polling || !isAuthenticated) return;

    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders();
    }, 3000); // 3 секунды

    return () => clearInterval(interval);
  }, [polling, fetchOrders, isAuthenticated]);

  // Обработка смены статуса
  const handleStatusChange = async (orderId: number, action: 'APPROVE' | 'REJECT') => {
    try {
      setError(null);
      await api.orders.completeOrder(orderId, action);
      // Обновляем список после изменения статуса
      fetchOrders();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка изменения статуса заявки');
      console.error('Error changing order status:', err);
    }
  };

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
      <Badge bg={statusInfo.variant}>
        {statusInfo.text}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <Container className="py-4">
      <Row className="my-4">
        <Col>
          <h1 style={{ fontWeight: '700', color: '#000' }}>
            Управление заявками (Администратор)
          </h1>
        </Col>
        <Col xs="auto">
          <Form.Check
            type="switch"
            id="polling-switch"
            label="Автообновление"
            checked={polling}
            onChange={(e) => setPolling(e.target.checked)}
          />
        </Col>
      </Row>

      {/* Фильтры */}
      <Row className="mb-4">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Статус</Form.Label>
            <Form.Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="">Все статусы</option>
              <option value="DRAFT">Черновик</option>
              <option value="FORMED">Сформирована</option>
              <option value="COMPLETED">Завершена</option>
              <option value="CANCELLED">Отменена</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Дата от</Form.Label>
            <Form.Control
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(0);
              }}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Дата до</Form.Label>
            <Form.Control
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(0);
              }}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Создатель (логин)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Поиск по логину..."
              value={creatorFilter}
              onChange={(e) => {
                setCreatorFilter(e.target.value);
                setPage(0);
              }}
            />
          </Form.Group>
        </Col>
      </Row>

      {error && (
        <Row className="my-3">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {loading && orders.length === 0 ? (
        <Row className="my-5">
          <Col className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </Spinner>
          </Col>
        </Row>
      ) : (
        <>
          <Row>
            <Col>
              {orders.length === 0 ? (
                <Alert variant="info">
                  <h5>Нет заявок</h5>
                  <p>Заявки не найдены по заданным фильтрам.</p>
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Создатель</th>
                        <th>Газы</th>
                        <th>Температура</th>
                        <th>Результаты</th>
                        <th>Статус</th>
                        <th>Дата создания</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order: Order) => {
                        const firstGas = order.gases && order.gases.length > 0 ? order.gases[0] : null;
                        const displayGas = firstGas ? {
                          name: firstGas.gasName,
                          formula: firstGas.gasFormula
                        } : null;

                        return (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.creatorLogin || `user_${order.userId}`}</td>
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
                                'Нет газов'
                              )}
                            </td>
                            <td>{order.tempResult ? `${order.tempResult}°C` : '-'}</td>
                            <td>
                              {order.completedResultsCount !== undefined ? (
                                <Badge bg={order.completedResultsCount > 0 ? 'success' : 'secondary'}>
                                  {order.completedResultsCount} / {order.gases?.length || 0}
                                </Badge>
                              ) : '-'}
                            </td>
                            <td>{getStatusBadge(order.status)}</td>
                            <td>{formatDate(order.timestamp)}</td>
                            <td>
                              <div className="d-flex gap-2">
                                {order.status === 'FORMED' && (
                                  <>
                                    <Button
                                      variant="success"
                                      size="sm"
                                      onClick={() => handleStatusChange(order.id, 'APPROVE')}
                                    >
                                      Одобрить
                                    </Button>
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      onClick={() => handleStatusChange(order.id, 'REJECT')}
                                    >
                                      Отклонить
                                    </Button>
                                  </>
                                )}
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => navigate(`/orders/${order.id}`)}
                                >
                                  Подробнее
                                </Button>
                              </div>
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

          {/* Пагинация */}
          {total > pageSize && (
            <Row className="mt-3">
              <Col>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    Показано {page * pageSize + 1} - {Math.min((page + 1) * pageSize, total)} из {total}
                  </div>
                  <div>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      disabled={page === 0}
                      onClick={() => setPage(page - 1)}
                    >
                      Назад
                    </Button>
                    <span className="mx-2">Страница {page + 1}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      disabled={(page + 1) * pageSize >= total}
                      onClick={() => setPage(page + 1)}
                    >
                      Вперед
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
};

export default ModeratorOrdersList;
