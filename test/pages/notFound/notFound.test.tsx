/**
 * @vitest-environment jsdom
 */
import {test } from 'vitest';
import { render } from '@testing-library/react';
import { NotFound } from '../../../src/pages/notFound/notFound';

test('renders name', async () => {
  const { getByText } = render(<NotFound error="test error" />);
  console.log(getByText);
});
