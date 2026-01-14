import type { WorkExperience } from '../resume.types';

export const workExperience: Readonly<WorkExperience[]> = [
  {
    id: 1,
    company: '옐로시스 주식회사',
    position: 'App & Frontend Engineer',
    startDate: '2023-07-24',
    endDate: null, // 재직 중
    description: '앱 및 웹뷰 수정, 프론트엔드 업무 담당',
  },
] as const;
