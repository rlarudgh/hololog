import { Container } from '@/shared/ui';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 py-8 mt-16">
      <Container>
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>&copy; {currentYear} kkh.log | All rights reserved.</p>
          <p className="mt-2 text-sm">
            Sharing insights on development and innovation.
          </p>
        </div>
      </Container>
    </footer>
  );
}
