import type { ShortUrlStats } from '@/shared/database/queries';

interface ShortUrlStatsViewProps {
  stats: ShortUrlStats;
}

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'Asia/Seoul',
});

function StatCard({
  title,
  value,
  detail,
}: {
  title: string;
  value: string | number;
  detail?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-700">
      <dt className="mb-2 text-sm text-gray-600 dark:text-gray-400">{title}</dt>
      <dd className="text-2xl font-bold break-all">{value}</dd>
      {detail && (
        <dd className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {detail}
        </dd>
      )}
    </div>
  );
}

/** URL Shortener 관리자 통계: 요약 카드 + URL별 클릭 수 표. */
export function ShortUrlStatsView({ stats }: ShortUrlStatsViewProps) {
  const { summary, urls } = stats;
  const { topUrl } = summary;

  return (
    <div className="space-y-10">
      <section aria-labelledby="short-url-summary">
        <h2 id="short-url-summary" className="mb-4 text-lg font-semibold">
          요약
        </h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="전체 단축 URL 수" value={summary.totalUrls} />
          <StatCard title="전체 클릭 수" value={summary.totalClicks} />
          <StatCard
            title="한 번 이상 클릭된 URL 수"
            value={summary.clickedUrls}
          />
          <StatCard
            title="가장 많이 클릭된 URL"
            value={topUrl ? `/${topUrl.shortCode}` : '-'}
            detail={
              topUrl ? `${topUrl.clicks}회 클릭` : '아직 클릭 기록이 없습니다.'
            }
          />
        </dl>
      </section>

      <section aria-labelledby="short-url-list">
        <h2 id="short-url-list" className="mb-4 text-lg font-semibold">
          URL별 사용량
        </h2>
        {urls.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            저장된 URL이 없습니다.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th scope="col" className="py-2 pr-4">
                    Short Code
                  </th>
                  <th scope="col" className="py-2 pr-4">
                    Original URL
                  </th>
                  <th scope="col" className="py-2 pr-4 text-right">
                    클릭 수
                  </th>
                  <th scope="col" className="py-2">
                    생성 시간
                  </th>
                </tr>
              </thead>
              <tbody>
                {urls.map((url) => (
                  <tr
                    key={url.shortCode}
                    className="border-b border-gray-100 align-top dark:border-gray-800"
                  >
                    <td className="py-2 pr-4 font-mono">{url.shortCode}</td>
                    <td className="max-w-md py-2 pr-4 break-all">
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {url.originalUrl}
                      </a>
                    </td>
                    <td className="py-2 pr-4 text-right">{url.clicks}</td>
                    <td className="py-2 whitespace-nowrap">
                      {dateFormatter.format(new Date(url.createdAt))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
