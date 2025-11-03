import type { IPersonalInfo } from './personal-info.types';

/**
 * @name personalInfo
 * @description Personal information for the about page
 * @type {IPersonalInfo}
 *
 * @readonly
 * @constant
 */
export const personalInfo: Readonly<IPersonalInfo> = {
  name: '김경호',
  job: '프론트엔드 개발자',
  description: '사용자의 편의성을 우선적으로 생각합니다.',
  passion: '사용자 경험(UX)과 웹 접근성',
  sharing: '개발 시 힘들었던 점들과 이를 해결한 방법',
  skills: {
    'Web(WebView)': [
      'Next.js',
      'React',
      'Vue',
      'TypeScript',
      'JavaScript',
    ] as const,
    App: ['React-Native', 'Flutter', 'Kotlin'] as const,
    Server: ['Nest.js', 'express', 'node.js', 'Prisma', 'Golang'] as const,
    'Etc.': ['Python', 'Cpp', 'MySQL'] as const,
  },
  certifications: ['정보처리기능사'] as const,
  socialLinks: {
    github: 'https://github.com/rlarudgh',
    linkedin: 'https://www.linkedin.com/in/kimkh05',
    email: 'mailto:kimkh05.dev@gmail.com',
  },
} as const;
