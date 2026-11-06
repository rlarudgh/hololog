import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/features/auth';
import { getAdminUser } from '@/shared/libs/admin-auth';
import { Container } from '@/shared/ui';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '관리자',
  robots: { index: false, follow: false },
};

/** proxy를 우회하더라도 여기서 다시 admin 세션을 확인한다. */
export default async function AdminLayout({ children }: PropsWithChildren) {
  const user = await getAdminUser();
  if (!user) redirect('/login?next=/admin');

  return (
    <Container className="py-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">관리자</h1>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <span>{user.email}</span>
          <LogoutButton />
        </div>
      </div>
      {children}
    </Container>
  );
}
