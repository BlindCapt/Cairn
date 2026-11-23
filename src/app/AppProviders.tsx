import type { ReactNode } from 'react';

/**
 * App-wide providers (auth session, data cache...) go here.
 * Empty for now: no business logic in the base setup.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
