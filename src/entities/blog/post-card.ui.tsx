import Link from "next/link";
import { BlogPost } from "@/shared/types/blog-type";

interface PostCardProps {
  post: BlogPost;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <Link href={`/blog/${post.slug}`}>
        <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 transition-colors">
          {post.title}
        </h2>
      </Link>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        {post.date}
      </p>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        {post.description}
      </p>
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
