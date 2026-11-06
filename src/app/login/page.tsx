import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth';
import { Container } from '@/shared/ui';

export const metadata: Metadata = {
  title: '관리자 로그인',
  robots: { index: false, follow: false },
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string | string[] }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-sm">
        <h1 className="mb-6 text-2xl font-bold">관리자 로그인</h1>
        <LoginForm next={typeof next === 'string' ? next : undefined} />
      </div>
    </Container>
  );
}
