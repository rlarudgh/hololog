'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { AdminPostSummary } from '@/shared/database/queries';

interface AdminPostListProps {
  posts: AdminPostSummary[];
}

/** 관리 화면 글 목록. 발행 토글과 삭제(2단계 확인)를 지원한다. */
export function AdminPostList({ posts }: AdminPostListProps) {
  const router = useRouter();
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (
    slug: string,
    init: RequestInit,
    failMessage: string,
  ) => {
    setError(null);
    setPendingSlug(slug);
    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(slug)}`, init);
      if (!res.ok) {
        setError(`${failMessage} (${res.status})`);
        return;
      }
      router.refresh();
    } catch {
      setError(`${failMessage} (네트워크 오류)`);
    } finally {
      setPendingSlug(null);
      setConfirmSlug(null);
    }
  };

  const togglePublished = (post: AdminPostSummary) =>
    mutate(
      post.slug,
      {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      },
      '발행 상태 변경에 실패했습니다.',
    );

  const deletePost = (slug: string) =>
    mutate(slug, { method: 'DELETE' }, '삭제에 실패했습니다.');

  if (posts.length === 0) {
    return <p className="text-gray-600 dark:text-gray-400">글이 없습니다.</p>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th scope="col" className="py-2 pr-4">
                제목
              </th>
              <th scope="col" className="py-2 pr-4">
                날짜
              </th>
              <th scope="col" className="py-2 pr-4">
                출처
              </th>
              <th scope="col" className="py-2 pr-4">
                상태
              </th>
              <th scope="col" className="py-2">
                작업
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => {
              const busy = pendingSlug === post.slug;
              const confirming = confirmSlug === post.slug;
              return (
                <tr
                  key={post.slug}
                  className="border-b border-gray-100 dark:border-gray-800"
                >
                  <td className="py-2 pr-4">
                    {post.published ? (
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:underline"
                      >
                        {post.title}
                      </Link>
                    ) : (
                      post.title
                    )}
                  </td>
                  <td className="py-2 pr-4 whitespace-nowrap">{post.date}</td>
                  <td className="py-2 pr-4">{post.source}</td>
                  <td className="py-2 pr-4">
                    {post.published ? '발행' : '초안'}
                  </td>
                  <td className="py-2 whitespace-nowrap space-x-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => togglePublished(post)}
                      className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      {post.published ? '발행 취소' : '발행'}
                    </button>
                    {confirming ? (
                      <>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => deletePost(post.slug)}
                          className="rounded bg-red-600 px-2 py-1 text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          삭제 확인
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => setConfirmSlug(null)}
                          className="rounded px-2 py-1 hover:underline"
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setConfirmSlug(post.slug)}
                        aria-label={`${post.title} 삭제`}
                        className="rounded px-2 py-1 text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
                      >
                        삭제
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
