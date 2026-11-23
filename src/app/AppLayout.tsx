import { NavLink, Outlet } from 'react-router';
import { navEntries } from './routes';
import styles from './AppLayout.module.css';

export function AppLayout() {
  return (
    <div className={styles.shell}>
      <main className={styles.main}>
        <Outlet />
      </main>
      <nav className={styles.nav} aria-label="Navigation principale">
        <ul className={styles.navList} role="list">
          {navEntries.map((entry) => (
            <li key={entry.to}>
              <NavLink
                to={entry.to}
                end
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                }
              >
                {entry.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
