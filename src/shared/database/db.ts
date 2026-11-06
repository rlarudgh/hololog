import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export type Database = PostgresJsDatabase<typeof schema>;

let instance: Database | undefined;

/**
 * DB 클라이언트를 처음 사용할 때 만든다.
 * import 시점에 연결 문자열을 요구하면 DATABASE_URL이 없는 빌드 환경에서
 * `next build`의 페이지 데이터 수집이 실패하므로, 검사를 실제 쿼리 시점으로 미룬다.
 */
export function getDb(): Database {
  if (instance) return instance;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const client = postgres(connectionString, { prepare: false });

  // schema를 전달해야 db.query 관계형 쿼리를 사용할 수 있다.
  // 로깅은 개발 환경에서만 활성화한다.
  instance = drizzle(client, {
    schema,
    logger: process.env.NODE_ENV !== 'production',
  });
  return instance;
}

/** `getDb()`로 위임하는 지연 초기화 핸들. 기존 `db.query...` 호출을 그대로 쓸 수 있다. */
export const db: Database = new Proxy({} as Database, {
  get(_target, prop) {
    const real = getDb();
    const value: unknown = Reflect.get(real, prop, real);
    return typeof value === 'function' ? value.bind(real) : value;
  },
});
