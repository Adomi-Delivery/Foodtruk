import { createPool } from 'mysql2/promise';

// llamado para la db
export const pool = createPool({
  host: '185.28.21.100',
  port: 3306,
  database: 'u379248934_wowbox',
  user: 'u379248934_wowbox',
  password: '@Soporte7805'
});
