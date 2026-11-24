export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

/** 저장된 값이 유효한 테마면 그대로, 아니면 시스템 설정을 따른다. */
export function resolveTheme(
  stored: string | null,
  prefersDark: boolean,
): Theme {
  if (stored === 'light' || stored === 'dark') return stored;
  return prefersDark ? 'dark' : 'light';
}

/** 현재 <html>에 적용된 테마 */
export function getCurrentTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/** <html>에 테마를 적용하고 저장한다(저장 실패는 무시: 시크릿 모드 등). */
export function setTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // localStorage를 쓸 수 없는 환경에서는 이번 페이지에만 적용한다.
  }
}

/**
 * 첫 페인트 전에 실행할 인라인 스크립트(테마 깜빡임 방지).
 * 사용자 입력이 들어가지 않는 고정 문자열이다.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var d=s==='dark'||(s!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;
