import type { ResumeData } from './resume.types';

export const resumeData: ResumeData = {
  personalInfo: {
    name: '김경호',
    gender: 'male',
    birthDate: '2005-04-23',
    phone: '010-3312-5024',
    email: 'kimkh05.dev@yellosis.com',
    location: '서울특별시',
    role: '크로스플랫폼 앱 & 프론트엔드 개발자',
  },
  certifications: [
    {
      id: 1,
      name: '정보처리기능사',
      issuer: '한국산업인력공단',
      acquiredDate: '2023-12-20',
    },
  ],
  workExperience: [
    {
      id: 1,
      company: '옐로시스',
      position: '앱 및 프론트엔드 개발자',
      startDate: '2023-07-24',
      endDate: null, // 재직 중
      description: '앱 및 웹뷰 수정, 프론트엔드 업무 담당',
    },
  ],
  projects: [
    {
      id: 1,
      name: '옐로시스 홈페이지 리뉴얼',
      role: '프론트엔드 개발',
      startDate: '2023-10-01',
      endDate: '2024-01-31',
      description:
        'Next.js와 TypeScript를 사용하여 SEO 및 웹사이트 성능 최적화',
      techStack: [
        'Next.js',
        'TypeScript',
        'Tailwind CSS',
        'Recoil',
        'Jest',
        'tanstack/react-query',
        'Github Actions',
      ],
    },
    {
      id: 2,
      name: 'Cym702: For Human 앱 유지보수',
      role: '앱 및 웹뷰 개발',
      startDate: '2024-06-04',
      endDate: null,
      description: '삼성헬스 SDK를 통한 데이터 연동 및 앱 유지보수 개발',
      techStack: ['Vue.js', 'JavaScript', 'VueX', 'Scss', 'Kotlin', 'Swift'],
    },
    {
      id: 3,
      name: 'Cym702: For Pet 앱 마이그레이션 및 유지보수',
      role: '앱 및 웹뷰 개발',
      startDate: '2024-02-01',
      endDate: null,
      description:
        'React-Native -> Flutter로 마이그레이션 진행 및 앱 유지보수 개발',
      techStack: [
        'React-Native',
        'TypeScript',
        'Flutter',
        'Dart',
        'Vue.js',
        'VueX',
        'Scss',
      ],
    },
    {
      id: 4,
      name: 'ChitaCare 앱 개발',
      role: '웹뷰 개발',
      startDate: '2024-06-17',
      endDate: '2025-01-24',
      description: 'Google Health Connect 로 헬스데이터 연동 및 웹뷰 개발',
      techStack: [
        'React',
        'TypeScript',
        'Emotion',
        'Storybook',
        '@tanstack/react-query',
        'recoil',
        'Jest',
      ],
    },
  ],
};
