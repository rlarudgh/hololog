import { count, desc, eq, sql, sum } from 'drizzle-orm';
import { db } from '../db';
import { shortUrls } from '../schema';

export interface ShortUrl {
  shortCode: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
}

export interface ShortUrlStats {
  summary: {
    totalUrls: number;
    totalClicks: number;
    clickedUrls: number;
    topUrl: ShortUrl | null;
  };
  urls: ShortUrl[];
}

type ShortUrlRow = typeof shortUrls.$inferSelect;

/** 통계 화면에 표시할 최대 URL 수. */
const STATS_URL_LIMIT = 50;

function toShortUrl(row: ShortUrlRow): ShortUrl {
  return {
    shortCode: row.shortCode,
    originalUrl: row.originalUrl,
    clicks: row.clicks,
    createdAt: row.createdAt.toISOString(),
  };
}

/**
 * 단축 URL을 저장한다. 같은 originalUrl이 이미 있으면 기존 행을 그대로 반환한다.
 * `created`로 새로 만들었는지(201) 기존 값인지(200)를 구분한다.
 */
export async function upsertShortUrl(
  shortCode: string,
  originalUrl: string,
): Promise<{ shortUrl: ShortUrl; created: boolean }> {
  const inserted = await db
    .insert(shortUrls)
    .values({ shortCode, originalUrl })
    .onConflictDoNothing({ target: shortUrls.originalUrl })
    .returning();

  if (inserted[0]) {
    return { shortUrl: toShortUrl(inserted[0]), created: true };
  }

  const [existing] = await db
    .select()
    .from(shortUrls)
    .where(eq(shortUrls.originalUrl, originalUrl))
    .limit(1);

  if (!existing) {
    throw new Error(`Short URL for ${originalUrl} disappeared after conflict`);
  }
  return { shortUrl: toShortUrl(existing), created: false };
}

/**
 * shortCode의 클릭 수를 1 올리고 원본 URL을 반환한다. 없으면 null.
 * 조회와 증가를 한 쿼리로 처리해 왕복을 줄인다.
 */
export async function resolveShortUrl(
  shortCode: string,
): Promise<string | null> {
  const [row] = await db
    .update(shortUrls)
    .set({ clicks: sql`${shortUrls.clicks} + 1` })
    .where(eq(shortUrls.shortCode, shortCode))
    .returning({ originalUrl: shortUrls.originalUrl });
  return row?.originalUrl ?? null;
}

/** 관리자 통계: 요약(전체/클릭 수/최다 클릭)과 클릭 수 순 URL 목록. */
export async function getShortUrlStats(): Promise<ShortUrlStats> {
  const [totals] = await db
    .select({
      totalUrls: count(),
      totalClicks: sum(shortUrls.clicks),
      clickedUrls: sql<number>`count(*) filter (where ${shortUrls.clicks} > 0)`,
    })
    .from(shortUrls);

  const rows = await db
    .select()
    .from(shortUrls)
    .orderBy(desc(shortUrls.clicks), desc(shortUrls.createdAt))
    .limit(STATS_URL_LIMIT);

  const urls = rows.map(toShortUrl);
  const top = rows[0];

  return {
    summary: {
      totalUrls: Number(totals?.totalUrls ?? 0),
      totalClicks: Number(totals?.totalClicks ?? 0),
      clickedUrls: Number(totals?.clickedUrls ?? 0),
      topUrl: top && top.clicks > 0 ? toShortUrl(top) : null,
    },
    urls,
  };
}
