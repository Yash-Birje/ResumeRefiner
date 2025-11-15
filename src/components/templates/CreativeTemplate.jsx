import { Mail, Phone, MapPin, Linkedin, Github, Globe, Zap } from 'lucide-react';
import { format } from 'date-fns';

const CreativeTemplate = ({ resume }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr === 'present') return 'Present';
    try {
      const [year, month] = dateStr.split('-');
      return format(new Date(year, month - 1), 'MMM yyyy');
    } catch {
      return dateStr;
    }
  };

  const hasContent = (section) => {
    if (!section) return false;
    if (Array.isArray(section)) return section.length > 0;
    if (typeof section === 'string') return section.trim().length > 0;
    return true;
  };

  return (
    <div className="min-h-full bg-white" style={{ fontFamily: '"Poppins", sans-serif' }}>
      {/* Top Header Bar with Gradient */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white p-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-5xl font-black tracking-tight">
              {resume.personalInfo?.fullName || 'Your Name'}
            </h1>
            {resume.targetRole && (
              <p className="text-xl font-light mt-2 text-purple-100">{resume.targetRole}</p>
            )}
          </div>
          <div className="text-right text-sm space-y-1">
            {resume.personalInfo?.email && <div>{resume.personalInfo.email}</div>}
            {resume.personalInfo?.phone && <div>{resume.personalInfo.phone}</div>}
            {resume.personalInfo?.location && <div>{resume.personalInfo.location}</div>}
          </div>
        </div>
      </div>

      <div className="p-8 max-w-4xl mx-auto">
        {/* Professional Summary */}
        {resume.summary && (
          <div className="mb-8 pb-6 border-b-2 border-purple-200">
            <h2 className="text-2xl font-black text-purple-600 mb-3 flex items-center gap-2">
              <Zap className="w-6 h-6" />
              ABOUT
            </h2>
            <p className="text-gray-700 leading-relaxed">{resume.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="col-span-2">
            {/* Work Experience */}
            {hasContent(resume.experience) && (
              <div className="mb-8">
                <h2 className="text-2xl font-black text-purple-600 mb-4">EXPERIENCE</h2>
                <div className="space-y-6">
                  {resume.experience.map((exp, index) => (
                    <div key={index} className="relative pl-6 pb-4 border-l-4 border-purple-400">
                      <div className="absolute -left-3.5 top-0 w-5 h-5 bg-purple-600 rounded-full" />
                      <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                      <p className="text-pink-600 font-semibold">{exp.company}</p>
                      {exp.startDate && (
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(exp.startDate)} - {formatDate(exp.endDate || (exp.current ? 'present' : ''))}
                        </p>
                      )}
                      {exp.description && exp.description.length > 0 && (
                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-700">
                          {exp.description.map((bullet, i) => (
                            bullet.trim() && <li key={i}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {hasContent(resume.projects) && (
              <div className="mb-8">
                <h2 className="text-2xl font-black text-purple-600 mb-4">PROJECTS</h2>
                <div className="grid grid-cols-2 gap-4">
                  {resume.projects.map((project, index) => (
                    <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-200">
                      <h3 className="font-bold text-gray-900 mb-1">{project.name}</h3>
                      {project.description && (
                        <p className="text-sm text-gray-700 mb-2">{project.description}</p>
                      )}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech, i) => (
                            <span key={i} className="px-2 py-0.5 bg-purple-600 text-white rounded text-xs">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {hasContent(resume.education) && (
              <div>
                <h2 className="text-2xl font-black text-purple-600 mb-4">EDUCATION</h2>
                <div className="space-y-4">
                  {resume.education.map((edu, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-bold text-gray-900">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h3>
                      <p className="text-pink-600 font-semibold text-sm">{edu.institution}</p>
                      {edu.startDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            {hasContent(resume.skills) && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-black text-purple-600 mb-3">SKILLS</h3>
                <div className="space-y-3">
                  {resume.skills.map((skillCategory, index) => (
                    <div key={index}>
                      {skillCategory.category && (
                        <h4 className="font-semibold text-sm text-gray-900 mb-1">{skillCategory.category}</h4>
                      )}
                      <div className="space-y-1">
                        {skillCategory.items?.map((skill, i) => (
                          <div key={i} className="flex items-center text-sm text-gray-700">
                            <span className="w-2 h-2 bg-purple-600 rounded-full mr-2" />
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Links */}
            {resume.personalInfo && (
              <div className="bg-pink-50 p-4 rounded-lg">
                <h3 className="font-black text-pink-600 mb-3">CONNECT</h3>
                <div className="space-y-2 text-sm">
                  {resume.personalInfo.linkedin && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Linkedin className="w-4 h-4" />
                      <span className="break-all">{resume.personalInfo.linkedin}</span>
                    </div>
                  )}
                  {resume.personalInfo.github && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Github className="w-4 h-4" />
                      <span className="break-all">{resume.personalInfo.github}</span>
                    </div>
                  )}
                  {resume.personalInfo.portfolio && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Globe className="w-4 h-4" />
                      <span className="break-all">{resume.personalInfo.portfolio}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
