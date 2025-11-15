import { Mail, Phone, MapPin, Linkedin, Github, Globe, Rocket } from 'lucide-react';
import { format } from 'date-fns';

const StartupTemplate = ({ resume }) => {
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
    <div className="min-h-full bg-white" style={{ fontFamily: '"Inter", "Segoe UI", sans-serif' }}>
      {/* Dynamic Header */}
      <div className="relative h-40 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-y-1/2 translate-x-1/2" />
        
        <div className="relative h-full flex flex-col justify-end px-8 pb-6 text-white">
          <h1 className="text-4xl font-black">{resume.personalInfo?.fullName || 'Your Name'}</h1>
          {resume.targetRole && (
            <p className="text-lg font-light mt-1 text-cyan-100">{resume.targetRole}</p>
          )}
        </div>
      </div>

      <div className="p-8 max-w-4xl mx-auto">
        {/* Contact Bar */}
        <div className="flex flex-wrap gap-4 mb-8 pb-6 border-b-2 border-gray-200">
          {resume.personalInfo?.email && (
            <span className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-teal-600" />
              {resume.personalInfo.email}
            </span>
          )}
          {resume.personalInfo?.phone && (
            <span className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-cyan-600" />
              {resume.personalInfo.phone}
            </span>
          )}
          {resume.personalInfo?.location && (
            <span className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-blue-600" />
              {resume.personalInfo.location}
            </span>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-8">
          {/* Main Content - 2 columns */}
          <div className="col-span-2 space-y-8">
            {/* Professional Summary */}
            {resume.summary && (
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-teal-600 mb-3">About</h2>
                <p className="text-gray-700 leading-relaxed">{resume.summary}</p>
              </div>
            )}

            {/* Work Experience */}
            {hasContent(resume.experience) && (
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-teal-600 mb-4 flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Experience
                </h2>
                <div className="space-y-6">
                  {resume.experience.map((exp, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900">{exp.position}</h3>
                          <p className="text-teal-600 font-semibold text-sm">{exp.company}</p>
                        </div>
                        {exp.startDate && (
                          <span className="text-xs font-semibold text-gray-500">
                            {formatDate(exp.startDate)} - {formatDate(exp.endDate || (exp.current ? 'present' : ''))}
                          </span>
                        )}
                      </div>
                      {exp.location && <p className="text-xs text-gray-600 mb-2">{exp.location}</p>}
                      {exp.description && exp.description.length > 0 && (
                        <ul className="space-y-1">
                          {exp.description.map((bullet, i) => (
                            bullet.trim() && (
                              <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-teal-500 font-bold mt-0.5">→</span>
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
            )}

            {/* Projects */}
            {hasContent(resume.projects) && (
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-cyan-600 mb-4">Projects</h2>
                <div className="grid grid-cols-2 gap-4">
                  {resume.projects.map((project, index) => (
                    <div key={index} className="border-2 border-cyan-200 rounded-lg p-4 hover:shadow-md transition">
                      <h3 className="font-bold text-gray-900 mb-1">{project.name}</h3>
                      {project.description && (
                        <p className="text-xs text-gray-700 mb-2">{project.description}</p>
                      )}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <span key={i} className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded text-xs font-semibold">
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            {hasContent(resume.skills) && (
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-lg">
                <h3 className="font-black text-teal-600 uppercase text-sm mb-3">Core Skills</h3>
                <div className="space-y-3">
                  {resume.skills.map((skillCategory, index) => (
                    <div key={index}>
                      {skillCategory.category && (
                        <h4 className="text-xs font-bold text-teal-700 uppercase mb-1">{skillCategory.category}</h4>
                      )}
                      <div className="space-y-1">
                        {skillCategory.items?.map((skill, i) => (
                          <p key={i} className="text-xs text-gray-700">✓ {skill}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {hasContent(resume.education) && (
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg">
                <h3 className="font-black text-blue-600 uppercase text-sm mb-3">Education</h3>
                <div className="space-y-3">
                  {resume.education.map((edu, index) => (
                    <div key={index}>
                      <h4 className="text-xs font-bold text-gray-900">{edu.degree}</h4>
                      <p className="text-xs text-blue-600 font-semibold">{edu.institution}</p>
                      {edu.startDate && (
                        <p className="text-xs text-gray-600 mt-1">
                          {formatDate(edu.startDate)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {resume.personalInfo && (
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-4 rounded-lg">
                <h3 className="font-black text-gray-900 uppercase text-sm mb-3">Connect</h3>
                <div className="space-y-2">
                  {resume.personalInfo.linkedin && (
                    <div className="flex items-center gap-2 text-xs">
                      <Linkedin className="w-4 h-4 text-blue-600" />
                      <span className="truncate">{resume.personalInfo.linkedin}</span>
                    </div>
                  )}
                  {resume.personalInfo.github && (
                    <div className="flex items-center gap-2 text-xs">
                      <Github className="w-4 h-4 text-gray-800" />
                      <span className="truncate">{resume.personalInfo.github}</span>
                    </div>
                  )}
                  {resume.personalInfo.portfolio && (
                    <div className="flex items-center gap-2 text-xs">
                      <Globe className="w-4 h-4 text-teal-600" />
                      <span className="truncate">{resume.personalInfo.portfolio}</span>
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

export default StartupTemplate;
