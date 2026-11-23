/** Reads a required `VITE_*` variable and fails loudly if it is missing. */
export function requireEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}
