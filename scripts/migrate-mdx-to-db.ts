/**
 * MDX → DB 동기화 스크립트.
 *
 * MDX 파일이 원본(source of truth)이며, 이 스크립트는 그 내용을 DB로 미러링한다.
 * - source='mdx' 글만 upsert/삭제한다(외부에서 작성한 source='api' 글은 보존).
 * - 멱등하므로 배포(빌드)마다 안전하게 재실행할 수 있다.
 *
 * 실행: `bun run db:sync` (또는 `bun run db:seed`)
 */
import { collectMdxPosts } from '@/shared/libs/mdx/collect-posts.lib';
import { upsertPostFromMdx, pruneMdxPostsNotIn } from '@/shared/database/queries';

async function main(): Promise<void> {
  const posts = collectMdxPosts();
  console.log(`📚 Found ${posts.length} MDX post(s). Syncing to DB...`);

  for (const post of posts) {
    await upsertPostFromMdx(post);
    console.log(`  ✓ ${post.slug}`);
  }

  const pruned = await pruneMdxPostsNotIn(posts.map((p) => p.slug));
  if (pruned.length > 0) {
    console.log(`🗑️  Pruned ${pruned.length} stale post(s): ${pruned.join(', ')}`);
  }

  console.log('✅ Sync complete.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  });
