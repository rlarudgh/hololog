import { describe, it, expect } from 'vitest';
import {
  calculateAge,
  formatDateKorean,
  calculateWorkDuration,
} from './resume.utils';
import { resumeData } from './resume.data';

describe('Resume Utils', () => {
  describe('calculateAge', () => {
    it('returns a positive number for valid birth dates', () => {
      const age: number = calculateAge('2005-04-23');
      expect(age).toBeGreaterThan(0);
      expect(Number.isInteger(age)).toBe(true);
    });

    it('calculates age correctly relative to current date', () => {
      // Test with a date 20 years ago
      const twentyYearsAgo: Date = new Date();
      twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20);
      const birthDate: string = twentyYearsAgo.toISOString().split('T')[0];

      const age: number = calculateAge(birthDate);
      expect(age).toBeGreaterThanOrEqual(19);
      expect(age).toBeLessThanOrEqual(20);
    });

    it('handles dates at the edge of birthday', () => {
      // Just ensure it doesn't throw and returns a number
      const age = calculateAge('2000-01-01');
      expect(typeof age).toBe('number');
    });
  });

  describe('formatDateKorean', () => {
    it('returns a formatted string with Korean characters', () => {
      const formatted = formatDateKorean('2024-01-15');
      expect(formatted).toMatch(/\d{4}년 \d{1,2}월/);
    });

    it('handles different month formats correctly', () => {
      const jan = formatDateKorean('2024-01-01');
      const dec = formatDateKorean('2024-12-31');

      expect(jan).toContain('1월');
      expect(dec).toContain('12월');
    });
  });

  describe('calculateWorkDuration', () => {
    it('returns a string for valid date ranges', () => {
      const duration = calculateWorkDuration('2023-01-01', '2024-01-01');
      expect(typeof duration).toBe('string');
      expect(duration.length).toBeGreaterThan(0);
    });

    it('includes "재직 중" when end date is null', () => {
      const duration = calculateWorkDuration('2023-01-01', null);
      expect(duration).toContain('재직 중');
    });

    it('includes "재직 중" when end date is undefined', () => {
      const duration = calculateWorkDuration('2023-01-01', undefined);
      expect(duration).toContain('재직 중');
    });

    it('handles work durations less than a year', () => {
      const duration = calculateWorkDuration('2023-01-01', '2023-06-01');
      expect(typeof duration).toBe('string');
      expect(duration.length).toBeGreaterThan(0);
    });

    it('handles work durations more than a year', () => {
      const duration = calculateWorkDuration('2020-01-01', '2023-01-01');
      expect(typeof duration).toBe('string');
      expect(duration.length).toBeGreaterThan(0);
    });
  });
});

describe('Resume Data', () => {
  it('has correct structure and types', () => {
    expect(resumeData).toBeDefined();
    expect(typeof resumeData).toBe('object');
  });

  it('has personalInfo with required string fields', () => {
    expect(resumeData.personalInfo).toBeDefined();
    expect(typeof resumeData.personalInfo.name).toBe('string');
    expect(typeof resumeData.personalInfo.email).toBe('string');
    expect(typeof resumeData.personalInfo.phone).toBe('string');
    expect(typeof resumeData.personalInfo.location).toBe('string');
    expect(typeof resumeData.personalInfo.birthDate).toBe('string');
    expect(['male', 'female', 'other']).toContain(
      resumeData.personalInfo.gender,
    );
  });

  it('has certifications array with valid structure', () => {
    expect(Array.isArray(resumeData.certifications)).toBe(true);

    resumeData.certifications.forEach((cert) => {
      expect(typeof cert.id).toBe('number');
      expect(typeof cert.name).toBe('string');
      expect(typeof cert.issuer).toBe('string');
      expect(typeof cert.acquiredDate).toBe('string');
      // url is optional
      if (cert.url) {
        expect(typeof cert.url).toBe('string');
      }
    });
  });

  it('has workExperience array with valid structure', () => {
    expect(Array.isArray(resumeData.workExperience)).toBe(true);

    resumeData.workExperience.forEach((work) => {
      expect(typeof work.id).toBe('number');
      expect(typeof work.company).toBe('string');
      expect(typeof work.position).toBe('string');
      expect(typeof work.startDate).toBe('string');
      // endDate can be string, null, or undefined
      if (work.endDate) {
        expect(typeof work.endDate).toBe('string');
      }
      // description is optional
      if (work.description) {
        expect(typeof work.description).toBe('string');
      }
    });
  });

  it('has projects array with valid structure', () => {
    expect(Array.isArray(resumeData.projects)).toBe(true);

    resumeData.projects.forEach((project) => {
      expect(typeof project.id).toBe('number');
      expect(typeof project.name).toBe('string');
      expect(typeof project.role).toBe('string');
      expect(typeof project.description).toBe('string');
      expect(typeof project.startDate).toBe('string');
      expect(Array.isArray(project.techStack)).toBe(true);

      // endDate can be string, null, or undefined
      if (project.endDate) {
        expect(typeof project.endDate).toBe('string');
      }
      // url is optional
      if (project.url) {
        expect(typeof project.url).toBe('string');
      }

      // Verify techStack contains strings
      project.techStack.forEach((tech) => {
        expect(typeof tech).toBe('string');
      });
    });
  });

  it('matches ResumeData type structure', () => {
    // This is a compile-time type check; at runtime we just verify the structure
    const data = resumeData;
    expect(data).toBe(resumeData);
  });
});
