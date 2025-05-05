import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { Path } from '@view/main/main';

export function Footer(): ReactElement {
  return (
    <footer>
      footer
      <Link to={Path.index}> test spa: back to index </Link>
    </footer>
  );
}
