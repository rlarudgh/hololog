import type { PersonalInfo } from '../resume.types';

export const personalInfo: Readonly<PersonalInfo> = {
  name: '김경호',
  gender: 'male',
  birthDate: '2005-04-23',
  phone: '010-3312-5024',
  email: 'kimkh05.dev@gmail.com',
  location: '서울특별시',
  role: '크로스플랫폼 앱 & 프론트엔드 개발자',
} as const;
