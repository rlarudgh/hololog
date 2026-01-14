'use client';

import { personalInfo, skillIcons } from '@/entities/user';
import { useState } from 'react';

/**
 * SkillsToggle Component
 *
 * Client Component that displays skill categories with expand/collapse functionality.
 * Uses useState for interactive toggle state.
 */
export function SkillsToggle() {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {},
  );

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  return (
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
              aria-expanded={openCategories[category]}
              aria-controls={`skills-${category}`}
            >
              <h3 className="text-2xl font-semibold">{category}</h3>
              <span className="text-2xl" aria-hidden="true">
                {openCategories[category] ? '-' : '+'}
              </span>
            </button>
            <div
              id={`skills-${category}`}
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
  );
}
