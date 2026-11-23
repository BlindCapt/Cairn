import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from './router';

const cases = [
  ['/', 'Aujourd’hui'],
  ['/week', 'Semaine'],
  ['/capture', 'Capture'],
  ['/profiles', 'Profils'],
  ['/items', 'Items'],
  ['/login', 'Connexion'],
] as const;

describe('router', () => {
  it.each(cases)('renders the title of %s', (path, title) => {
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />);
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
  });
});
