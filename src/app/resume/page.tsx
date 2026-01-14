import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaVenusMars,
  FaAward,
} from 'react-icons/fa';
import { MdWork, MdFolderSpecial } from 'react-icons/md';
import { resumeData } from '@/entities/resume';
import {
  calculateAge,
  formatDateKorean,
  calculateWorkDuration,
} from '@/entities/resume';

export default function ResumePage() {
  const { personalInfo, certifications, workExperience, projects } = resumeData;
  const age = calculateAge(personalInfo.birthDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {personalInfo.name.charAt(0)}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {personalInfo.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">프론트엔드 개발자</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <FaBirthdayCake className="text-blue-500" />
                  <span>
                    {formatDateKorean(personalInfo.birthDate)} (만 {age}세)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <FaVenusMars className="text-pink-500" />
                  <span>
                    {personalInfo.gender === 'male' ? '남성' : '여성'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <FaPhone className="text-green-500" />
                  <span>{personalInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <FaEnvelope className="text-red-500" />
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {personalInfo.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-700 md:col-span-2">
                  <FaMapMarkerAlt className="text-purple-500" />
                  <span>{personalInfo.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <MdWork className="text-3xl text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900">경력</h2>
          </div>
          <div className="space-y-6">
            {workExperience.map((work) => (
              <div
                key={work.id}
                className="border-l-4 border-blue-500 pl-6 py-2 relative"
              >
                <div className="absolute left-0 top-6 w-3 h-3 bg-blue-500 rounded-full transform -translate-x-[7px]" />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {work.position}
                    </h3>
                    <p className="text-lg text-gray-700">{work.company}</p>
                  </div>
                  <div className="text-sm text-gray-600 mt-1 sm:mt-0">
                    {formatDateKorean(work.startDate)} ~{' '}
                    {work.endDate ? formatDateKorean(work.endDate) : '현재'}
                  </div>
                </div>
                {work.description && (
                  <p className="text-gray-600 mt-2">{work.description}</p>
                )}
                <p className="text-sm text-blue-600 mt-2 font-medium">
                  {calculateWorkDuration(work.startDate, work.endDate)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <MdFolderSpecial className="text-3xl text-purple-500" />
            <h2 className="text-2xl font-bold text-gray-900">프로젝트</h2>
          </div>
          <div className="space-y-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {project.name}
                    </h3>
                    <p className="text-gray-600">{project.role}</p>
                  </div>
                  <div className="text-sm text-gray-600 mt-2 sm:mt-0 sm:text-right">
                    {formatDateKorean(project.startDate)} ~{' '}
                    {project.endDate
                      ? formatDateKorean(project.endDate)
                      : '현재'}
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links section */}
                {(project.url || project.links) && (
                  <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-100">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        프로젝트 보기 →
                      </a>
                    )}
                    {project.links?.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {link.label} →
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <FaAward className="text-3xl text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">자격증</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaAward className="text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {cert.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">{cert.issuer}</p>
                    <p className="text-sm text-gray-500">
                      {formatDateKorean(cert.acquiredDate)}
                    </p>
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
                      >
                        자세히 보기 →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>마지막 업데이트: {new Date().toLocaleDateString('ko-KR')}</p>
        </div>
      </div>
    </div>
  );
}
