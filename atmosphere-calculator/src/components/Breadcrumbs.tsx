import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  customItems?: BreadcrumbItem[];
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ customItems }) => {
  const location = useLocation();

  // Генерируем breadcrumbs автоматически из URL, если не переданы customItems
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) {
      return customItems;
    }

    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Главная', path: '/' }
    ];

    let currentPath = '';
    pathnames.forEach((pathname) => {
      currentPath += `/${pathname}`;

      // Преобразуем pathname в читаемое название
      let name = pathname;
      if (pathname === 'gases') {
        name = 'Услуги (Газы)';
      } else if (pathname === 'gas' || !isNaN(Number(pathname))) {
        // Пропускаем, обработаем через customItems
        return;
      }

      breadcrumbs.push({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        path: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Не показываем breadcrumbs на главной странице
  if (location.pathname === '/') {
    return null;
  }

  return (
    <Container className="my-3">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-light p-3 rounded" style={{ backgroundColor: '#ffffff', border: '1px solid #e6e6e6' }}>
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <li
                key={item.path}
                className={`breadcrumb-item ${isLast ? 'active' : ''}`}
                aria-current={isLast ? 'page' : undefined}
                style={{
                  color: isLast ? '#000' : '#666',
                  fontWeight: isLast ? '500' : '400'
                }}
              >
                {isLast ? (
                  <span>{item.name}</span>
                ) : (
                  <Link
                    to={item.path}
                    className="text-decoration-none"
                    style={{ color: '#666', transition: 'color 0.2s ease' }}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </Container>
  );
};

export default Breadcrumbs;
