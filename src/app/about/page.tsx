import { Container } from '@/shared/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about this blog and its creator',
};

export default function AboutPage() {
  return (
    <Container className="py-12">
      <div> hi </div>
    </Container>
  );
}
