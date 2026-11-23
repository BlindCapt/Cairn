import { createBrowserRouter, Navigate, type RouteObject } from 'react-router';
import { LoginPage } from '@/features/auth';
import { CapturePage } from '@/features/capture';
import { ItemsPage } from '@/features/items';
import { ProfilesPage } from '@/features/profiles';
import { TodayPage } from '@/features/today';
import { WeekPage } from '@/features/week';
import { AppLayout } from './AppLayout';
import { paths } from './routes';

export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { path: paths.today, element: <TodayPage /> },
      { path: paths.week, element: <WeekPage /> },
      { path: paths.capture, element: <CapturePage /> },
      { path: paths.profiles, element: <ProfilesPage /> },
      { path: paths.items, element: <ItemsPage /> },
    ],
  },
  { path: paths.login, element: <LoginPage /> },
  { path: '*', element: <Navigate to={paths.today} replace /> },
];

export const router = createBrowserRouter(routes);
