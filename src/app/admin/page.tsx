import { AdminPostList } from '@/features/admin-posts';
import { listAdminPosts } from '@/shared/database/queries';

export default async function AdminPage() {
  const posts = await listAdminPosts();

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">글 관리 ({posts.length})</h2>
      <AdminPostList posts={posts} />
    </section>
  );
}
