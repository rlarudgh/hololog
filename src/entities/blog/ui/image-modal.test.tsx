import { render, screen, fireEvent } from '@/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ImageModal } from './image-modal';

// Mock createPortal to render in the test DOM
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (children: React.ReactNode) => children,
  };
});

describe('ImageModal Component', () => {
  const mockProps = {
    src: 'https://example.com/test-image.jpg',
    alt: 'Test image description',
    isOpen: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    // Reset body overflow after each test
    document.body.style.overflow = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
  });

  it('renders when isOpen is true', () => {
    render(<ImageModal {...mockProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByAltText('Test image description')).toBeInTheDocument();
    expect(screen.getByLabelText('이미지 닫기')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<ImageModal {...mockProps} isOpen={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
      screen.queryByAltText('Test image description'),
    ).not.toBeInTheDocument();
  });

  it('calls onClose when clicking on the background', () => {
    render(<ImageModal {...mockProps} />);

    const background = screen.getByRole('dialog');
    fireEvent.click(background);

    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the close button', () => {
    render(<ImageModal {...mockProps} />);

    const closeButton = screen.getByLabelText('이미지 닫기');
    fireEvent.click(closeButton);

    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking on the image', () => {
    render(<ImageModal {...mockProps} />);

    const image = screen.getByAltText('Test image description');
    fireEvent.click(image);

    expect(mockProps.onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when pressing Escape key', () => {
    render(<ImageModal {...mockProps} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when pressing other keys', () => {
    render(<ImageModal {...mockProps} />);

    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'Space' });

    expect(mockProps.onClose).not.toHaveBeenCalled();
  });

  it('sets body overflow to hidden when opened', () => {
    render(<ImageModal {...mockProps} />);

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('resets body overflow when unmounted', () => {
    const { unmount } = render(<ImageModal {...mockProps} />);

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('unset');
  });

  it('resets body overflow when closed', () => {
    const { rerender } = render(<ImageModal {...mockProps} />);

    expect(document.body.style.overflow).toBe('hidden');

    rerender(<ImageModal {...mockProps} isOpen={false} />);

    expect(document.body.style.overflow).toBe('unset');
  });

  it('has proper accessibility attributes', () => {
    render(<ImageModal {...mockProps} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  it('applies correct styles to the image', () => {
    render(<ImageModal {...mockProps} />);

    const image = screen.getByAltText('Test image description');
    expect(image).toHaveClass(
      'max-w-full',
      'max-h-full',
      'object-contain',
      'shadow-2xl',
    );
  });

  it('applies correct styles to the close button', () => {
    render(<ImageModal {...mockProps} />);

    const closeButton = screen.getByLabelText('이미지 닫기');
    expect(closeButton).toHaveClass(
      'w-10',
      'h-10',
      'bg-white',
      'text-gray-800',
      'rounded-full',
    );
  });

  it('stops event propagation on image click', () => {
    render(<ImageModal {...mockProps} />);

    const image = screen.getByAltText('Test image description');
    const clickEvent = new MouseEvent('click', { bubbles: true });

    const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation');

    fireEvent(image, clickEvent);

    expect(stopPropagationSpy).toHaveBeenCalled();
  });
});
