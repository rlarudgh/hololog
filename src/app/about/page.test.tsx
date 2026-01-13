import { render, screen, fireEvent } from '@testing-library/react';
import AboutPage from './page';

// Mock the entities
vi.mock('@/entities/user', () => ({
  personalInfo: {
    name: 'Test User',
    job: 'Test Developer',
    description: 'A test developer',
    passion: 'testing',
    sharing: 'test knowledge',
    socialLinks: {
      github: 'https://github.com/test',
      linkedin: 'https://linkedin.com/in/test',
      email: 'mailto:test@example.com',
    },
    skills: {
      'Frontend': ['React', 'Vue', 'Angular'],
      'Backend': ['Node.js', 'Python'],
    },
    certifications: ['AWS', 'GCP'],
  },
  skillIcons: {
    React: '⚛️',
    Vue: '💚',
    Angular: '🅰️',
    'Node.js': '🟢',
    Python: '🐍',
  },
}));

// Mock the icons
vi.mock('@/shared/ui/icon', () => ({
  GitHubIcon: () => <span data-testid="github-icon">GitHub</span>,
  LinkedInIcon: () => <span data-testid="linkedin-icon">LinkedIn</span>,
  MailIcon: () => <span data-testid="mail-icon">Mail</span>,
}));

describe('AboutPage', () => {
  it('renders personal information correctly', () => {
    render(<AboutPage />);

    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText(/Test User/)).toBeInTheDocument();
    expect(screen.getByText(/Test Developer/)).toBeInTheDocument();
  });

  it('renders social links with icons', () => {
    render(<AboutPage />);

    expect(screen.getByTestId('github-icon')).toBeInTheDocument();
    expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument();
    expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
  });

  it('renders all skill categories', () => {
    render(<AboutPage />);

    expect(screen.getByText('My Skills')).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
  });

  it('toggles skill categories when clicked', () => {
    render(<AboutPage />);

    const frontendButton = screen.getByText('Frontend').closest('button');
    const backendButton = screen.getByText('Backend').closest('button');

    // Initially, categories should show '+' icon (collapsed state)
    expect(frontendButton?.textContent).toContain('+');
    expect(backendButton?.textContent).toContain('+');

    // Skills are in DOM but not interactable due to CSS
    const reactElement = screen.queryByText('React');
    expect(reactElement).toBeInTheDocument();

    // Click Frontend category
    if (frontendButton) {
      fireEvent.click(frontendButton);
    }

    // Should now show '-' icon (expanded state)
    expect(frontendButton?.textContent).toContain('-');

    // Backend should still show '+'
    expect(backendButton?.textContent).toContain('+');

    // Click Backend category
    if (backendButton) {
      fireEvent.click(backendButton);
    }

    // Backend should now show '-'
    expect(backendButton?.textContent).toContain('-');
  });

  it('can collapse expanded categories', () => {
    render(<AboutPage />);

    const frontendButton = screen.getByText('Frontend').closest('button');

    // Expand Frontend
    if (frontendButton) {
      fireEvent.click(frontendButton);
    }
    expect(frontendButton?.textContent).toContain('-');

    // Collapse Frontend
    if (frontendButton) {
      fireEvent.click(frontendButton);
    }
    expect(frontendButton?.textContent).toContain('+');
  });

  it('renders certifications', () => {
    render(<AboutPage />);

    expect(screen.getByText('Certifications')).toBeInTheDocument();
    expect(screen.getByText('AWS')).toBeInTheDocument();
    expect(screen.getByText('GCP')).toBeInTheDocument();
  });

  it('displays + icon for collapsed categories', () => {
    render(<AboutPage />);

    const frontendButton = screen.getByText('Frontend').closest('button');
    expect(frontendButton?.textContent).toContain('+');
  });

  it('displays - icon for expanded categories', () => {
    render(<AboutPage />);

    const frontendButton = screen.getByText('Frontend').closest('button');

    // Expand category
    if (frontendButton) {
      fireEvent.click(frontendButton);
    }

    expect(frontendButton?.textContent).toContain('-');
  });

  it('handles social links correctly', () => {
    render(<AboutPage />);

    const githubLink = screen.getByTestId('github-icon').closest('a');
    const linkedinLink = screen.getByTestId('linkedin-icon').closest('a');
    const mailLink = screen.getByTestId('mail-icon').closest('a');

    expect(githubLink).toHaveAttribute('href', 'https://github.com/test');
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/test');
    expect(mailLink).toHaveAttribute('href', 'mailto:test@example.com');

    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders skill icons when category is expanded', () => {
    render(<AboutPage />);

    const frontendButton = screen.getByText('Frontend').closest('button');

    if (frontendButton) {
      fireEvent.click(frontendButton);
    }

    // Skill icons should be visible
    expect(screen.getByText('⚛️')).toBeInTheDocument();
    expect(screen.getByText('💚')).toBeInTheDocument();
  });
});
