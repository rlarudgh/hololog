export interface PersonalInfo {
  name: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string; // YYYY-MM-DD format
  phone: string;
  email: string;
  location: string;
  role: string;
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  acquiredDate: string; // YYYY-MM-DD format
  url?: string;
}

export interface WorkExperience {
  id: number;
  company: string;
  position: string;
  startDate: string; // YYYY-MM-DD format
  endDate?: string | null; // null if currently working
  description?: string;
}

export interface Project {
  id: number;
  name: string;
  role: string;
  startDate: string; // YYYY-MM-DD format
  endDate?: string | null; // null if currently working
  description: string;
  techStack: string[];
  url?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  certifications: Certification[];
  workExperience: WorkExperience[];
  projects: Project[];
}
