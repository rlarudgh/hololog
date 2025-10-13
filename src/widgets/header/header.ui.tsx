import Link from "next/link";
import { Container } from "@/shared/ui";

export function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-700 py-4">
      <Container>
        <nav className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold hover:text-blue-600 transition-colors"
          >
            My Blog
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link
              href="/blog"
              className="hover:text-blue-600 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="hover:text-blue-600 transition-colors"
            >
              About
            </Link>
          </div>
        </nav>
      </Container>
    </header>
  );
}
