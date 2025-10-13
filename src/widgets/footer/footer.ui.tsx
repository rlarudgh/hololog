import { Container } from "@/shared/ui";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 py-8 mt-16">
      <Container>
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Built with Next.js, MDX, and FSD Architecture
          </p>
        </div>
      </Container>
    </footer>
  );
}
