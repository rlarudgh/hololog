import { personalInfo } from './data/personal-info.data';
import { certifications } from './data/certifications.data';
import { workExperience } from './data/work-experience.data';
import { projects } from './data/projects.data';

export const resumeData = {
  personalInfo,
  certifications,
  workExperience,
  projects,
} as const;
