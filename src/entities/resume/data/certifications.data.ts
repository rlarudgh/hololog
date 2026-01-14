import type { Certification } from '../resume.types';

export const certifications: Readonly<Certification[]> = [
  {
    id: 1,
    name: '정보처리기능사',
    issuer: 'HRDK 한국산업인력공단',
    acquiredDate: '2023-12-20',
  },
] as const;
