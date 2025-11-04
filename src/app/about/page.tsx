'use client';

import { personalInfo, skillIcons } from '@/entities/user';
import { Container } from '@/shared/ui';
import { GitHubIcon, LinkedInIcon, MailIcon } from '@/shared/ui/icon';
import { useState } from 'react';

export default function AboutPage() {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {},
  );

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <Container className="py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">About Me</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          안녕하세요! 저는 {personalInfo.name}입니다. 저는 {personalInfo.job}
          이며,
          {personalInfo.description} 저는 {personalInfo.passion}에 열정을 가지고
          있으며, 이 블로그를 통해 {personalInfo.sharing}에 대한 지식을 공유하고
          있습니다.
        </p>
      </div>

      <div className="flex justify-center space-x-6 mt-8">
        <a
          href={personalInfo.socialLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <GitHubIcon />
        </a>
        <a
          href={personalInfo.socialLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <LinkedInIcon />
        </a>
        <a
          href={personalInfo.socialLinks.email}
          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <MailIcon />
        </a>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold text-center mb-8">My Skills</h2>
        <div className="space-y-4">
          {Object.entries(personalInfo.skills)?.map(([category, skills]) => (
            <div
              key={category}
              className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
            >
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex justify-between items-center py-4 text-left"
              >
                <h3 className="text-2xl font-semibold">{category}</h3>
                <span className="text-2xl">
                  {openCategories[category] ? '-' : '+'}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openCategories[category]
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="flex flex-wrap justify-center gap-4 pt-2 pb-4">
                  {skills?.map((skill) => (
                    <div
                      key={skill}
                      className="flex flex-col items-center gap-2 p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800 w-36"
                    >
                      <div className="text-4xl text-gray-700 dark:text-gray-300">
                        {skillIcons[skill]}
                      </div>
                      <span className="text-gray-800 dark:text-gray-200">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold text-center mb-6">Certifications</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {personalInfo.certifications?.map((cert: string) => (
            <span
              key={cert}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full"
            >
              {cert}
            </span>
          ))}
        </div>
      </div>
    </Container>
  );
}
