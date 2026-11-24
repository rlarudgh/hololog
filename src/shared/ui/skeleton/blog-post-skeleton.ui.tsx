/** 글 목록 한 행(PostCard)과 같은 모양의 로딩 자리표시자 */
export function BlogPostSkeletonItem() {
  return (
    <div
      aria-hidden="true"
      className="grid animate-pulse gap-x-6 gap-y-2 border-b border-slate-200 py-6 sm:grid-cols-[7rem_1fr] dark:border-slate-800"
    >
      <div className="mt-2 h-3 w-20 rounded bg-slate-100 dark:bg-slate-800" />
      <div className="space-y-2">
        <div className="h-5 w-3/4 rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-4 w-5/6 rounded bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  );
}
