import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { format } from 'date-fns';

const ModernTemplate = ({ resume }) => {
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
    <div className="flex h-full" style={{ fontFamily: '"Inter", "Open Sans", sans-serif' }}>
      {/* Left Sidebar - 35% */}
      <div className="w-[35%] bg-blue-900 text-white p-8">
        {/* Contact Information */}
        {resume.personalInfo && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-blue-300">
              CONTACT
            </h2>

            <div className="space-y-3 text-sm">
              {resume.personalInfo.email && (
                <div className="flex items-start space-x-2">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="break-all">{resume.personalInfo.email}</span>
                </div>
              )}

              {resume.personalInfo.phone && (
                <div className="flex items-start space-x-2">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{resume.personalInfo.phone}</span>
                </div>
              )}

              {resume.personalInfo.location && (
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{resume.personalInfo.location}</span>
                </div>
              )}

              {resume.personalInfo.linkedin && (
                <div className="flex items-start space-x-2">
                  <Linkedin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="break-all">{resume.personalInfo.linkedin}</span>
                </div>
              )}

              {resume.personalInfo.github && (
                <div className="flex items-start space-x-2">
                  <Github className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="break-all">{resume.personalInfo.github}</span>
                </div>
              )}

              {resume.personalInfo.portfolio && (
                <div className="flex items-start space-x-2">
                  <Globe className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="break-all">{resume.personalInfo.portfolio}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills */}
        {hasContent(resume.skills) && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-blue-300">
              SKILLS
            </h2>

            <div className="space-y-4">
              {resume.skills.map((skillCategory, index) => (
                <div key={index}>
                  {skillCategory.category && (
                    <h3 className="text-sm font-semibold mb-2 text-blue-200">
                      {skillCategory.category}
                    </h3>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {skillCategory.items?.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-blue-800 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Main Content - 65% */}
      <div className="w-[65%] p-8">
        {/* Name and Title */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {resume.personalInfo?.fullName || 'Your Name'}
          </h1>

          {resume.targetRole && (
            <p className="text-xl text-primary font-medium">{resume.targetRole}</p>
          )}
        </div>

        {/* Professional Summary */}
        {resume.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b-2 border-primary">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{resume.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {hasContent(resume.experience) && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b-2 border-primary">
              WORK EXPERIENCE
            </h2>

            <div className="space-y-4">
              {resume.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.position}</h3>
                      <p className="text-sm text-primary font-medium">{exp.company}</p>
                    </div>

                    <div className="text-right text-sm text-gray-600">
                      {exp.startDate && (
                        <div>
                          {formatDate(exp.startDate)} - {formatDate(exp.endDate || (exp.current ? 'present' : ''))}
                        </div>
                      )}
                      {exp.location && <div>{exp.location}</div>}
                    </div>
                  </div>

                  {exp.description && exp.description.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-gray-700">
                      {exp.description.map((bullet, bulletIndex) => (
                        bullet.trim() && (
                          <li key={bulletIndex} className="leading-relaxed">
                            {bullet}
                          </li>
                        )
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
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b-2 border-primary">
              PROJECTS
            </h2>

            <div className="space-y-4">
              {resume.projects.map((project, index) => (
                <div key={index}>
                  <div className="mb-1">
                    <h3 className="font-bold text-gray-900">{project.name}</h3>

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {project.description && (
                    <p className="text-sm text-gray-700 mb-2">{project.description}</p>
                  )}

                  {project.highlights && project.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-gray-700">
                      {project.highlights.map((highlight, highlightIndex) => (
                        highlight.trim() && (
                          <li key={highlightIndex} className="leading-relaxed">
                            {highlight}
                          </li>
                        )
                      ))}
                    </ul>
                  )}

                  {project.link && (
                    <p className="text-xs text-primary mt-1">{project.link}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {hasContent(resume.education) && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b-2 border-primary">
              EDUCATION
            </h2>

            <div className="space-y-3">
              {resume.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h3>
                      <p className="text-sm text-primary font-medium">{edu.institution}</p>
                    </div>

                    <div className="text-right text-sm text-gray-600">
                      {edu.startDate && (
                        <div>
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </div>
                      )}
                      {edu.gpa && <div>GPA: {edu.gpa}</div>}
                    </div>
                  </div>

                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-sm text-gray-700">
                      {edu.achievements.map((achievement, achIndex) => (
                        achievement.trim() && (
                          <li key={achIndex}>{achievement}</li>
                        )
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;
