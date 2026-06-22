import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const client = postgres(connectionString, { prepare: false });

// schema를 전달해야 db.query 관계형 쿼리를 사용할 수 있다.
// 로깅은 개발 환경에서만 활성화한다.
export const db = drizzle(client, {
  schema,
  logger: process.env.NODE_ENV !== 'production',
});
