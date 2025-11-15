import { Mail, Phone, MapPin, Linkedin, Github, Globe, Star } from 'lucide-react';
import { format } from 'date-fns';

const InfographicTemplate = ({ resume }) => {
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
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6" style={{ fontFamily: '"Helvetica Neue", sans-serif' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 mb-6 shadow-lg">
          <h1 className="text-5xl font-black">{resume.personalInfo?.fullName || 'Your Name'}</h1>
          {resume.targetRole && (
            <p className="text-2xl font-light mt-2 text-indigo-100">{resume.targetRole}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            {resume.personalInfo?.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {resume.personalInfo.email}
              </span>
            )}
            {resume.personalInfo?.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {resume.personalInfo.phone}
              </span>
            )}
            {resume.personalInfo?.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {resume.personalInfo.location}
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        {resume.summary && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border-l-4 border-indigo-600">
            <p className="text-gray-700 leading-relaxed text-lg">{resume.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Experience */}
          {hasContent(resume.experience) && (
            <div className="col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-black text-indigo-600 mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6" />
                  EXPERIENCE
                </h2>
                <div className="space-y-4">
                  {resume.experience.map((exp, index) => (
                    <div key={index} className="relative pl-5 pb-4">
                      <div className="absolute left-0 top-1 w-3 h-3 bg-purple-600 rounded-full" />
                      <h3 className="font-bold text-gray-900 text-lg">{exp.position}</h3>
                      <p className="text-purple-600 font-semibold">{exp.company}</p>
                      {exp.startDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(exp.startDate)} - {formatDate(exp.endDate || (exp.current ? 'present' : ''))}
                        </p>
                      )}
                      {exp.description && exp.description.length > 0 && (
                        <ul className="mt-2 space-y-1 text-sm text-gray-700">
                          {exp.description.map((bullet, i) => (
                            bullet.trim() && (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-purple-600 mt-0.5">▸</span>
                                <span>{bullet}</span>
                              </li>
                            )
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Skills Sidebar */}
          {hasContent(resume.skills) && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-black text-purple-600 mb-4">SKILLS</h3>
              <div className="space-y-4">
                {resume.skills.map((skillCategory, index) => (
                  <div key={index}>
                    {skillCategory.category && (
                      <h4 className="font-bold text-gray-900 text-sm mb-2">{skillCategory.category}</h4>
                    )}
                    <div className="space-y-2">
                      {skillCategory.items?.map((skill, i) => (
                        <div key={i} className="text-xs">
                          <p className="font-semibold text-gray-700">{skill}</p>
                          <div className="h-1.5 bg-gray-200 rounded-full mt-1">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                              style={{ width: `${75 + (i % 3) * 8}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Education */}
          {hasContent(resume.education) && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-black text-indigo-600 mb-4">EDUCATION</h2>
              <div className="space-y-4">
                {resume.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-indigo-300 pl-4">
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-purple-600 font-semibold text-sm">{edu.institution}</p>
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

          {/* Projects */}
          {hasContent(resume.projects) && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-black text-purple-600 mb-4">PROJECTS</h2>
              <div className="space-y-4">
                {resume.projects.slice(0, 3).map((project, index) => (
                  <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-3 rounded-lg">
                    <h3 className="font-bold text-gray-900 text-sm">{project.name}</h3>
                    {project.description && (
                      <p className="text-xs text-gray-700 mt-1">{project.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Links */}
        {resume.personalInfo && (
          <div className="flex justify-center gap-4 mt-6 pt-4 border-t-2 border-indigo-200">
            {resume.personalInfo.linkedin && (
              <a href={resume.personalInfo.linkedin} className="flex items-center gap-1 text-sm text-indigo-600 font-semibold">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            )}
            {resume.personalInfo.github && (
              <a href={resume.personalInfo.github} className="flex items-center gap-1 text-sm text-purple-600 font-semibold">
                <Github className="w-4 h-4" />
                GitHub
              </a>
            )}
            {resume.personalInfo.portfolio && (
              <a href={resume.personalInfo.portfolio} className="flex items-center gap-1 text-sm text-pink-600 font-semibold">
                <Globe className="w-4 h-4" />
                Portfolio
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfographicTemplate;
