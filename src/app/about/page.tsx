import { Container } from "@/shared/ui";

export const metadata = {
  title: "About - My MDX Blog",
  description: "Learn more about this blog and its creator",
};

export default function AboutPage() {
  return (
    <Container className="py-12">
      <h1 className="text-5xl font-bold mb-8">About</h1>

      <div className="max-w-none">
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
          Welcome to my blog! This is a space where I share my thoughts,
          experiences, and knowledge about web development.
        </p>

        <h2 className="text-3xl font-bold mb-4 mt-8">About This Blog</h2>
        <p>This blog is built with modern web technologies:</p>
        <ul>
          <li>
            <strong>Next.js 14+</strong>: React framework with App Router
          </li>
          <li>
            <strong>MDX</strong>: Markdown with React components
          </li>
          <li>
            <strong>TypeScript</strong>: Type-safe development
          </li>
          <li>
            <strong>Tailwind CSS</strong>: Utility-first styling
          </li>
          <li>
            <strong>FSD Architecture</strong>: Feature-Sliced Design for
            scalability
          </li>
        </ul>

        <h2 className="text-3xl font-bold mb-4 mt-8">Development Practices</h2>
        <p>This project follows industry best practices:</p>
        <ul>
          <li>
            <strong>Git Flow</strong>: Structured branching strategy
          </li>
          <li>
            <strong>Conventional Commits</strong>: Standardized commit messages
          </li>
          <li>
            <strong>Husky</strong>: Git hooks for code quality
          </li>
          <li>
            <strong>Commitlint</strong>: Automated commit message validation
          </li>
        </ul>

        <h2 className="text-3xl font-bold mb-4 mt-8">Get In Touch</h2>
        <p>
          Feel free to reach out if you have any questions or just want to
          connect!
        </p>
      </div>
    </Container>
  );
}
