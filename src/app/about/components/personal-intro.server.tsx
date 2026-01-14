import { personalInfo } from '@/entities/user';
import { GitHubIcon, LinkedInIcon, MailIcon } from '@/shared/ui/icon';

/**
 * PersonalIntro Component
 *
 * Server Component that displays personal introduction information.
 * Includes name, role, description, and social links.
 */
export function PersonalIntro() {
  return (
    <>
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
          aria-label="GitHub"
        >
          <GitHubIcon />
        </a>
        <a
          href={personalInfo.socialLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          aria-label="LinkedIn"
        >
          <LinkedInIcon />
        </a>
        <a
          href={personalInfo.socialLinks.email}
          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          aria-label="Email"
        >
          <MailIcon />
        </a>
      </div>
    </>
  );
}
