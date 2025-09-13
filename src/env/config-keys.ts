export const CONFIG_KEYS = {
  DB_HOST: 'DB_HOST',
  DB_PORT: 'DB_PORT',
  DB_USER: 'DB_USER',
  DB_PASSWORD: 'DB_PASSWORD',
  DB_NAME: 'DB_NAME',
  ORIGIN: 'ORIGIN',
} as const;

// Type for the keys
export type ConfigKey = typeof CONFIG_KEYS[keyof typeof CONFIG_KEYS]; 