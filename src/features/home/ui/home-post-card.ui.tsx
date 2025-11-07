import Link from 'next/link';
import { BlogPost } from '@/shared/types/blog-type';
import { ROUTES } from '@/shared/configs/routes';

interface HomePostCardProps {
  post: BlogPost;
}

export function HomePostCard({ post }: HomePostCardProps) {
  return (
    <Link
      href={ROUTES.BLOG_POST(post.slug)}
      className="block border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white truncate">
            {post.title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {post.date}
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 mb-3">
            {post.description}
          </p>
        </div>
        <span className="ml-4 text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
          Read more →
        </span>
      </div>
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
