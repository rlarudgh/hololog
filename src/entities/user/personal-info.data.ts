import type { IPersonalInfo } from './personal-info.types';

export const personalInfo: Readonly<IPersonalInfo> = {
  name: '김경호',
  job: '프론트엔드 개발자',
  description: '사용자의 편의성을 우선적으로 생각합니다.',
  passion: '사용자 경험(UX)과 웹 접근성',
  sharing: 'React, TypeScript, Next.js 등 프론트엔드 기술 스택',
  skills: {
    'Web(WebView)': ['Next.js', 'React', 'Vue', 'TypeScript', 'JavaScript'],
    App: ['React-Native', 'Flutter', 'Kotlin'],
    Server: ['Nest.js', 'express', 'node.js', 'Prisma', 'Golang'],
    'Etc.': ['Python', 'Cpp', 'MySQL'],
  },
  certifications: ['정보처리기능사'],
  socialLinks: {
    github: 'https://github.com/rlarudgh',
    linkedin: 'https://www.linkedin.com/in/kimkh05',
    email: 'mailto:kimkh05.dev@gmail.com',
  },
} as const;
