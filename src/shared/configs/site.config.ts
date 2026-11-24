/**
 * 사이트/작성자 정보. 포트폴리오(kkh-log)와 같은 정보를 보여주기 위한 단일 출처.
 */
export const PORTFOLIO_URL = 'https://kkh-log.pages.dev';

export const SITE = {
  brand: 'kkh.log',
  author: '김경호',
  role: 'Software Engineer',
  description: '개발하며 배운 것과 겪은 일을 기록합니다.',
} as const;

export interface NavLink {
  href: string;
  label: string;
  /** 외부 링크면 새 탭으로 열고 ↗ 표시 */
  external?: boolean;
}

/** 사이트 내부 메뉴 */
export const NAV_LINKS: NavLink[] = [{ href: '/', label: 'Blog' }];

/** 사이드바 하단 외부 링크 */
export const SOCIAL_LINKS: NavLink[] = [
  { href: PORTFOLIO_URL, label: 'Portfolio', external: true },
  { href: 'https://github.com/rlarudgh', label: 'GitHub', external: true },
  {
    href: 'https://linkedin.com/in/kimkh05',
    label: 'LinkedIn',
    external: true,
  },
];

/**
 * 현재 경로에서 활성화할 메뉴인지 판단한다.
 * 블로그 메뉴('/')는 홈과 글 상세(/blog/...)에서 모두 활성화된다.
 */
export function isActiveNav(href: string, pathname: string): boolean {
  if (href === '/') {
    return (
      pathname === '/' || pathname === '/blog' || pathname.startsWith('/blog/')
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
