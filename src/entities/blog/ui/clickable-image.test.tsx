import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ClickableImage } from './clickable-image';

// Mock createPortal to render modals in the test DOM
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (children: React.ReactNode) => children,
  };
});

// Mock ImageModal to test its integration
vi.mock('./image-modal', () => ({
  ImageModal: ({
    isOpen,
    onClose,
    alt,
  }: {
    isOpen: boolean;
    onClose: () => void;
    alt: string;
  }) => (
    <div
      role="dialog"
      aria-label="Mock modal"
      style={{ display: isOpen ? 'block' : 'none' }}
    >
      <span>{alt}</span>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe('ClickableImage Component', () => {
  const defaultProps = {
    src: 'https://example.com/test-image.jpg',
    alt: 'Test image description',
    className: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders image with correct attributes', () => {
    render(<ClickableImage {...defaultProps} />);

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test image description');
    expect(image).toHaveClass(
      'cursor-pointer',
      'transition-all',
      'duration-200',
      'hover:brightness-95',
    );
  });

  it('renders with custom className', () => {
    render(
      <ClickableImage
        {...defaultProps}
        className="custom-class another-class"
      />,
    );

    const image = screen.getByRole('img');
    expect(image).toHaveClass('custom-class', 'another-class');
    expect(image).toHaveClass('cursor-pointer'); // should still have default classes
  });

  it('renders with width and height attributes', () => {
    render(<ClickableImage {...defaultProps} width={300} height={200} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('width', '300');
    expect(image).toHaveAttribute('height', '200');
  });

  it('does not render width and height when not provided', () => {
    render(<ClickableImage {...defaultProps} />);

    const image = screen.getByRole('img');
    expect(image).not.toHaveAttribute('width');
    expect(image).not.toHaveAttribute('height');
  });

  it('opens modal when image is clicked', async () => {
    render(<ClickableImage {...defaultProps} />);

    const image = screen.getByRole('img');
    fireEvent.click(image);

    await waitFor(
      () => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  it('shows modal with correct content when clicked', async () => {
    render(<ClickableImage {...defaultProps} />);

    const image = screen.getByRole('img');
    fireEvent.click(image);

    await waitFor(
      () => {
        expect(screen.getByText('Test image description')).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Close' }),
        ).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  it('closes modal when close button is clicked', async () => {
    render(<ClickableImage {...defaultProps} />);

    // Open modal
    const image = screen.getByRole('img');
    fireEvent.click(image);

    await waitFor(
      () => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      },
      { timeout: 1000 },
    );

    // Close modal
    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);

    await waitFor(
      () => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  it('handles multiple clicks correctly', async () => {
    render(<ClickableImage {...defaultProps} />);

    const image = screen.getByRole('img');

    // Click to open
    fireEvent.click(image);

    await waitFor(
      () => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      },
      { timeout: 1000 },
    );

    // Click close button to close
    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);

    await waitFor(
      () => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      },
      { timeout: 1000 },
    );

    // Click image again to reopen
    fireEvent.click(image);

    await waitFor(
      () => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  it('has correct default styling classes', () => {
    render(<ClickableImage {...defaultProps} />);

    const image = screen.getByRole('img');
    expect(image).toHaveClass('cursor-pointer');
    expect(image).toHaveClass('transition-all');
    expect(image).toHaveClass('duration-200');
    expect(image).toHaveClass('hover:brightness-95');
  });

  it('combines default and custom classes correctly', () => {
    render(<ClickableImage {...defaultProps} className="w-full h-auto" />);

    const image = screen.getByRole('img');
    expect(image).toHaveClass('w-full', 'h-auto'); // custom classes
    expect(image).toHaveClass(
      'cursor-pointer',
      'transition-all',
      'duration-200',
      'hover:brightness-95',
    ); // default classes
  });

  it('handles empty className prop', () => {
    render(<ClickableImage {...defaultProps} className="" />);

    const image = screen.getByRole('img');
    expect(image).toHaveClass('cursor-pointer'); // should still have default classes
    expect(image.className).toContain('cursor-pointer');
  });

  it('handles missing className prop', () => {
    render(
      <ClickableImage src={defaultProps.src} alt={defaultProps.alt} />,
    );

    const image = screen.getByRole('img');

    expect(image).toHaveClass(
      'cursor-pointer',
      'transition-all',
      'duration-200',
      'hover:brightness-95',
    );
  });

  it('has proper accessibility with alt text', () => {
    render(<ClickableImage {...defaultProps} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAccessibleName('Test image description');
  });

  it('handles empty alt text gracefully', () => {
    render(<ClickableImage {...defaultProps} alt="" />);

    const image = screen.getByRole('presentation');
    expect(image).toHaveAttribute('alt', '');
    expect(image).toBeInTheDocument();
  });

  it('maintains proper DOM structure', () => {
    render(<ClickableImage {...defaultProps} />);

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass('cursor-pointer');
  });
});
