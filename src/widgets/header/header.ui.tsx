import Link from 'next/link';
import { Container } from '@/shared/ui';

const navItems = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '/blog',
    label: 'Blog',
  },
  {
    href: '/about',
    label: 'About',
  },
];

export function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-700 py-4">
      <Container>
        <nav className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold hover:text-blue-600 transition-colors text-white"
          >
            My Blog
          </Link>
          <div className="flex gap-6">
            {navItems?.map((item) => (
              <Link
                href={item.href}
                key={`${item.label}`}
                className="hover:text-blue-600 transition-colors text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </Container>
    </header>
  );
}
