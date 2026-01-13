import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CodeBlock } from './code-block.ui';

const meta = {
  title: 'shared/ui/CodeBlock',
  component: CodeBlock,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const JavaScript: Story = {
  args: {
    className: 'language-javascript',
    children: `function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome, \${name}\`;
}

greet('World');`,
  },
};

export const TypeScript: Story = {
  args: {
    className: 'language-typescript',
    children: `interface User {
  id: number;
  name: string;
  email: string;
}

const getUser = (id: number): User => {
  return {
    id,
    name: 'John Doe',
    email: 'john@example.com',
  };
};`,
  },
};

export const Dart: Story = {
  args: {
    className: 'language-dart',
    children: `class User {
  final String name;
  final int age;

  User({required this.name, required this.age});

  void greet() {
    print('Hello, \$name!');
  }
}

void main() {
  final user = User(name: 'John', age: 30);
  user.greet();
}`,
  },
};

export const Python: Story = {
  args: {
    className: 'language-python',
    children: `def greet(name):
    """Greet a person by name."""
    print(f"Hello, {name}!")
    return f"Welcome, {name}"

if __name__ == "__main__":
    greet("World")`,
  },
};

export const XML: Story = {
  args: {
    className: 'language-xml',
    children: `<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <appSettings>
    <add key="AppName" value="MyApp" />
    <add key="Version" value="1.0.0" />
  </appSettings>
</configuration>`,
  },
};

export const ShortCode: Story = {
  args: {
    className: 'language-javascript',
    children: `const x = 42;`,
  },
};

export const LongCodeWithLineNumbers: Story = {
  args: {
    className: 'language-typescript',
    children: `// This is a longer code example
// It should show line numbers

interface Config {
  host: string;
  port: number;
  ssl: boolean;
}

const config: Config = {
  host: 'localhost',
  port: 8080,
  ssl: true,
};

function startServer(config: Config) {
  console.log(\`Starting server on \${config.host}:\${config.port}\`);
  // Server implementation...
}

startServer(config);

// End of example`,
  },
};

export const Bash: Story = {
  args: {
    className: 'language-bash',
    children: `#!/bin/bash

echo "Starting deployment..."
npm run build
npm run deploy

echo "Deployment complete!"`,
  },
};
