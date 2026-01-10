import { FC, useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert, Pagination } from 'react-bootstrap';
import GasCard from '../components/GasCard';
import { Gas } from '../types';
import { getGases, isBackendAvailable } from '../services/api';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setNameFilter, setFormulaFilter, resetFilters } from '../store/filtersSlice';

const GasesList: FC = () => {
  const [gases, setGases] = useState<Gas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Получаем фильтры из Redux
  const dispatch = useAppDispatch();
  const nameFilter = useAppSelector((state) => state.filters.nameFilter);
  const formulaFilter = useAppSelector((state) => state.filters.formulaFilter);

  // Пагинация
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 12;

  // Загрузка данных
  const loadGases = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getGases({
        name: nameFilter,
        formula: formulaFilter,
        page: currentPage,
        size: pageSize
      });

      setGases(response.items);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);

      // Показываем предупреждение если используем mock данные
      if (!isBackendAvailable()) {
        setError('Бэкенд недоступен. Показаны тестовые данные.');
      }
    } catch (err) {
      console.error('Error loading gases:', err);
      // При ошибке загружаем моки напрямую
      const mockResponse = await import('../data/mockGasesData').then(m =>
        m.getMockGasesPaginated(currentPage, pageSize, nameFilter)
      );
      setGases(mockResponse.items);
      setTotalPages(mockResponse.totalPages);
      setTotalItems(mockResponse.totalItems);
      setError('Бэкенд недоступен. Показаны тестовые данные.');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка при монтировании и изменении фильтров/страницы
  useEffect(() => {
    loadGases();
  }, [currentPage]);

  // Обработка применения фильтров
  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0); // Сбрасываем на первую страницу
    loadGases();
  };

  // Обработка сброса фильтров
  const handleResetFilters = () => {
    dispatch(resetFilters());
    setCurrentPage(0);
    // После сброса фильтров загружаем данные
    setTimeout(() => loadGases(), 0);
  };

  // Генерация элементов пагинации
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    // Корректируем startPage если мы близко к концу
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    // Первая страница
    if (startPage > 0) {
      items.push(
        <Pagination.First key="first" onClick={() => setCurrentPage(0)} />
      );
    }

    // Предыдущая
    if (currentPage > 0) {
      items.push(
        <Pagination.Prev key="prev" onClick={() => setCurrentPage(currentPage - 1)} />
      );
    }

    // Страницы
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => setCurrentPage(page)}
        >
          {page + 1}
        </Pagination.Item>
      );
    }

    // Следующая
    if (currentPage < totalPages - 1) {
      items.push(
        <Pagination.Next key="next" onClick={() => setCurrentPage(currentPage + 1)} />
      );
    }

    // Последняя
    if (endPage < totalPages - 1) {
      items.push(
        <Pagination.Last key="last" onClick={() => setCurrentPage(totalPages - 1)} />
      );
    }

    return <Pagination className="justify-content-center">{items}</Pagination>;
  };

  return (
    <Container className="py-4">
      <Row className="my-4">
        <Col>
          <h1 style={{ fontWeight: '700', color: '#000' }}>
            Каталог атмосферных газов
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Всего услуг: <strong>{totalItems}</strong>
          </p>
        </Col>
      </Row>

      {/* Фильтры */}
      <Row className="my-4">
        <Col>
          <Form onSubmit={handleApplyFilters} className="bg-light p-4 rounded shadow-sm">
            <h5 className="mb-3" style={{ fontWeight: '600', color: '#000' }}>Фильтры поиска</h5>
            <Row className="align-items-end">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Название газа</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Введите название..."
                    value={nameFilter}
                    onChange={(e) => dispatch(setNameFilter(e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Формула</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Введите формулу..."
                    value={formulaFilter}
                    onChange={(e) => dispatch(setFormulaFilter(e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <div className="d-flex gap-2 mb-3 filter-buttons">
                  <Button type="submit" variant="primary" className="flex-fill">
                    Применить
                  </Button>
                  <Button
                    type="button"
                    variant="outline-primary"
                    onClick={handleResetFilters}
                    className="flex-fill"
                  >
                    Сбросить
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      {/* Предупреждение об использовании mock данных */}
      {error && (
        <Row className="my-3">
          <Col>
            <Alert variant="warning" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Загрузка */}
      {loading && (
        <Row className="my-5">
          <Col className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </Spinner>
          </Col>
        </Row>
      )}

      {/* Список газов */}
      {!loading && gases.length > 0 && (
        <>
          <Row>
            {gases.map((gas) => (
              <Col key={gas.id} xs={12} md={6} lg={4} className="mb-4">
                <GasCard gas={gas} />
              </Col>
            ))}
          </Row>

          {/* Пагинация */}
          <Row className="my-4">
            <Col>
              {renderPagination()}
            </Col>
          </Row>
        </>
      )}

      {/* Нет результатов */}
      {!loading && gases.length === 0 && (
        <Row className="my-5">
          <Col className="text-center">
            <Alert variant="info">
              <h5>Ничего не найдено</h5>
              <p>Попробуйте изменить параметры фильтрации</p>
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default GasesList;
