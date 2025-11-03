export interface IPersonalInfo {
  name: string;
  job: string;
  description: string;
  passion: string;
  sharing: string;
  skills: Record<Skills, string[]>;
  certifications: string[];
  socialLinks: Record<SocialLinks, string>;
}

export type Skills = 'Web(WebView)' | 'App' | 'Server' | 'Etc.';

export type SocialLinks = 'github' | 'linkedin' | 'email';
