/** Route paths, shared by the router and the navigation bar. */
export const paths = {
  today: '/',
  week: '/week',
  capture: '/capture',
  profiles: '/profiles',
  items: '/items',
  login: '/login',
} as const;

/** Main navigation, in display order. Labels are user-facing (French). */
export const navEntries = [
  { to: paths.today, label: 'Aujourd’hui' },
  { to: paths.week, label: 'Semaine' },
  { to: paths.capture, label: 'Capture' },
  { to: paths.profiles, label: 'Profils' },
  { to: paths.items, label: 'Items' },
] as const;
