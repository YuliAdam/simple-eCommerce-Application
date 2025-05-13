import { Link } from 'react-router-dom';
import { Path } from '@config/routesConfig';

export function Footer() {
  return (
    <footer>
      footer
      <Link to={Path.empty}> test spa: back to index </Link>
    </footer>
  );
}
