import { FC } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home: FC = () => {
  return (
    <Container className="py-4">
      {/* Заголовок */}
      <Row className="my-5">
        <Col>
          <div className="text-center animate-fade-in">
            <h1 className="display-3 mb-4" style={{ fontWeight: '700', color: '#000' }}>
              AtmosphericTempCalc
            </h1>
            <p className="lead" style={{ color: '#666', fontSize: '1.2rem' }}>
              Профессиональный инструмент для расчета температуры атмосферы на основе концентрации газов
            </p>
          </div>
        </Col>
      </Row>

      {/* Описание системы */}
      <Row className="my-5">
        <Col md={6} className="mb-3">
          <Card className="shadow-sm h-100 home-info-card">
            <Card.Body>
              <Card.Title style={{ color: '#000', fontWeight: '600' }}>
                <h3>О системе</h3>
              </Card.Title>
              <Card.Text>
                Наша система предоставляет точные расчеты температуры атмосферы,
                учитывая концентрацию различных газов. Калькулятор использует современные
                физико-химические модели для получения достоверных результатов.
              </Card.Text>
              <Card.Text>
                <strong>Возможности системы:</strong>
              </Card.Text>
              <ul>
                <li>Расчет температуры на основе состава атмосферы</li>
                <li>Учет концентрации различных газов</li>
                <li>Подробная информация о каждом газе</li>
                <li>История расчетов и заявок</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-3">
          <Card className="shadow-sm h-100 home-info-card">
            <Card.Body>
              <Card.Title style={{ color: '#000', fontWeight: '600' }}>
                <h3>Атмосферные газы</h3>
              </Card.Title>
              <Card.Text>
                В нашей базе данных представлены основные атмосферные газы:
              </Card.Text>
              <ul>
                <li><strong>Азот (N₂)</strong> - 78% атмосферы</li>
                <li><strong>Кислород (O₂)</strong> - 21% атмосферы</li>
                <li><strong>Аргон (Ar)</strong> - 0.93% атмосферы</li>
                <li><strong>Углекислый газ (CO₂)</strong> - 0.04% атмосферы</li>
                <li>И другие газы...</li>
              </ul>
              <Card.Text className="mt-3">
                Каждый газ имеет уникальные физико-химические свойства,
                влияющие на температуру атмосферы.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Дополнительная информация */}
      <Row className="my-5">
        <Col md={4} className="mb-3">
          <Card className="text-center shadow-sm h-100 home-info-card">
            <Card.Body>
              <div style={{ fontSize: '3rem' }}>⚛️</div>
              <Card.Title className="mt-3">Точность</Card.Title>
              <Card.Text>
                Используем современные физико-химические модели для точных расчетов
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="text-center shadow-sm h-100 home-info-card">
            <Card.Body>
              <div style={{ fontSize: '3rem' }}>🔬</div>
              <Card.Title className="mt-3">Научный подход</Card.Title>
              <Card.Text>
                Все расчеты основаны на проверенных научных данных
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="text-center shadow-sm h-100 home-info-card">
            <Card.Body>
              <div style={{ fontSize: '3rem' }}>📊</div>
              <Card.Title className="mt-3">Удобство</Card.Title>
              <Card.Text>
                Интуитивно понятный интерфейс для работы с данными
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
