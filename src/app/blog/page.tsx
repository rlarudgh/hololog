import { Container } from "@/shared/ui";
import { PostCard } from "@/entities/blog";
import { getAllPosts } from "@/shared/libs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - My MDX Blog",
  description: "Read the latest posts about web development, Next.js, and more",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <Container className="py-12">
      <h1 className="text-5xl font-bold mb-8">Blog</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
        Thoughts, tutorials, and insights about web development
      </p>

      <div className="space-y-8">
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet. Check back soon!</p>
        ) : (
          posts.map((post) => <PostCard key={post.slug} post={post} />)
        )}
      </div>
    </Container>
  );
}
