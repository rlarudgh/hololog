import fs from 'fs';
import path from 'path';
import { BlogPost, BlogMetadata } from '@/shared/types/blog-type';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getAllPosts(): BlogPost[] {
  try {
    // 디렉토리가 존재하지 않으면 빈 배열 반환
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);

    const posts = fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        const metadata = extractMetadata(fileContents);

        return {
          slug,
          ...metadata,
        };
      });

    return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.warn('Failed to read posts directory:', error);
    return [];
  }
}

export function getPostBySlug(
  slug: string,
): { metadata: BlogMetadata; content: string } | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const metadata = extractMetadata(fileContents);
    const content = fileContents.replace(/---[\s\S]*?---/, '').trim();

    return {
      metadata,
      content,
    };
  } catch {
    return null;
  }
}

function extractMetadata(content: string): BlogMetadata {
  const metadataMatch = content.match(/---\n([\s\S]*?)\n---/);

  if (!metadataMatch) {
    return {
      title: 'Untitled',
      date: new Date().toISOString().split('T')[0],
      description: '',
    };
  }

  const metadataString = metadataMatch[1];
  const metadata: Record<string, unknown> = {};

  metadataString.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      let value = valueParts.join(':').trim();

      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

      if (
        key.trim() === 'tags' &&
        value.startsWith('[') &&
        value.endsWith(']')
      ) {
        metadata[key.trim()] = value
          .slice(1, -1)
          .split(',')
          .map((tag) => tag.trim().replace(/['"]/g, ''));
      } else {
        metadata[key.trim()] = value;
      }
    }
  });

  return {
    title: (metadata.title as string) || 'Untitled',
    date: (metadata.date as string) || new Date().toISOString().split('T')[0],
    description: (metadata.description as string) || '',
    tags: metadata.tags as string[] | undefined,
  };
}
