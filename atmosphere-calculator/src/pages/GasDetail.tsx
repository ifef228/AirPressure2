import { FC, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import Breadcrumbs from '../components/Breadcrumbs';
import { Gas } from '../types';
import { getGasById } from '../services/api';

// Дефолтное изображение
const DEFAULT_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e9ecef' width='400' height='400'/%3E%3Ctext fill='%236c757d' font-family='Arial' font-size='48' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3E⚛️ Газ%3C/text%3E%3C/svg%3E`;

const GasDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [gas, setGas] = useState<Gas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGas = async () => {
      if (!id) {
        setError('ID газа не указан');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const gasData = await getGasById(parseInt(id));

        if (gasData) {
          setGas(gasData);
        } else {
          setError('Газ не найден');
        }
      } catch (err) {
        setError('Ошибка при загрузке данных');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadGas();
  }, [id]);

  // Breadcrumbs для страницы деталей
  const breadcrumbItems = gas ? [
    { name: 'Главная', path: '/' },
    { name: 'Услуги (Газы)', path: '/gases' },
    { name: gas.name, path: `/gases/${gas.id}` }
  ] : [];

  if (loading) {
    return (
      <Container className="my-5">
        <Row>
          <Col className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </Spinner>
            <p className="mt-3">Загрузка данных...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  if (error || !gas) {
    return (
      <Container className="my-5">
        <Row>
          <Col>
            <Alert variant="danger">
              <h4>Ошибка</h4>
              <p>{error || 'Газ не найден'}</p>
              <Button as={Link} to="/gases" variant="primary">
                Вернуться к списку
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  const imageUrl = gas.imageUrl || DEFAULT_IMAGE;

  return (
    <>
      <Breadcrumbs customItems={breadcrumbItems} />

      <Container className="my-4">
        <Row>
          {/* Изображение */}
          <Col md={5} className="mb-3">
            <Card className="shadow-sm">
              <Card.Img
                variant="top"
                src={imageUrl}
                alt={gas.name}
                className="gas-detail-image"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                }}
              />
            </Card>
          </Col>

          {/* Информация */}
          <Col md={7} className="mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body>
                <h1 className="mb-3 gas-detail-title" style={{ fontWeight: '700', color: '#000' }}>{gas.name}</h1>

                <Card className="bg-light mb-3">
                  <Card.Body className="gas-detail-properties">
                    <Row>
                      <Col sm={4}>
                        <strong>Формула:</strong>
                      </Col>
                      <Col sm={8}>
                        <span className="fs-5">{gas.formula}</span>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Card className="bg-light mb-3">
                  <Card.Body className="gas-detail-properties">
                    <Row>
                      <Col sm={4}>
                        <strong>ID:</strong>
                      </Col>
                      <Col sm={8}>
                        {gas.id}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <div className="mt-4">
                  <h4>Описание</h4>
                  <p className="lead">{gas.detailedDescription}</p>
                </div>

                <div className="mt-4">
                  <h5 className="text-muted">Применение в расчетах</h5>
                  <p>
                    Этот газ используется в расчетах температуры атмосферы.
                    Его концентрация и физико-химические свойства влияют на
                    итоговый результат вычислений.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Дополнительная информация */}
        <Row className="mt-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Дополнительная информация</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6} className="mb-3">
                    <h6 className="text-primary">Свойства газа</h6>
                    <ul>
                      <li>Используется в атмосферных расчетах</li>
                      <li>Влияет на температурный баланс</li>
                      <li>Учитывается при моделировании</li>
                    </ul>
                  </Col>
                  <Col md={6} className="mb-3">
                    <h6 className="text-primary">Как использовать</h6>
                    <ul>
                      <li>Добавьте газ в заявку</li>
                      <li>Укажите концентрацию и температуру</li>
                      <li>Получите результат расчета</li>
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default GasDetail;
