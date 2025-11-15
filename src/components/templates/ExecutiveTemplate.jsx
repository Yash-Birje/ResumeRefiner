import { Mail, Phone, MapPin, Linkedin, Github, Globe, Award } from 'lucide-react';
import { format } from 'date-fns';

const ExecutiveTemplate = ({ resume }) => {
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
    <div className="min-h-full bg-white" style={{ fontFamily: '"Georgia", serif' }}>
      {/* Elegant Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white p-10">
        <h1 className="text-5xl font-light tracking-wider">
          {resume.personalInfo?.fullName || 'Your Name'}
        </h1>
        {resume.targetRole && (
          <p className="text-2xl font-light mt-2 text-slate-300 tracking-widest">{resume.targetRole}</p>
        )}
        <div className="flex gap-6 mt-6 text-sm text-slate-400">
          {resume.personalInfo?.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo?.phone && <span>•</span>}
          {resume.personalInfo?.phone && <span>{resume.personalInfo.phone}</span>}
          {resume.personalInfo?.location && <span>•</span>}
          {resume.personalInfo?.location && <span>{resume.personalInfo.location}</span>}
        </div>
      </div>

      <div className="p-10 max-w-4xl mx-auto">
        {/* Professional Summary */}
        {resume.summary && (
          <div className="mb-8 pb-6 border-b-2 border-slate-300">
            <p className="text-gray-700 leading-relaxed italic">{resume.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-4 gap-8">
          {/* Main Content - 3 columns */}
          <div className="col-span-3 space-y-8">
            {/* Work Experience */}
            {hasContent(resume.experience) && (
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-300 pb-2 mb-4">
                  Professional Experience
                </h2>
                <div className="space-y-6">
                  {resume.experience.map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-lg font-semibold text-slate-900">{exp.position}</h3>
                        {exp.startDate && (
                          <span className="text-sm text-gray-600">
                            {formatDate(exp.startDate)} - {formatDate(exp.endDate || (exp.current ? 'present' : ''))}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 font-light mb-2">{exp.company}</p>
                      {exp.location && <p className="text-sm text-gray-600 mb-2">{exp.location}</p>}
                      {exp.description && exp.description.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                          {exp.description.map((bullet, i) => (
                            bullet.trim() && <li key={i} className="leading-relaxed">{bullet}</li>
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
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-300 pb-2 mb-4">
                  Notable Projects
                </h2>
                <div className="space-y-5">
                  {resume.projects.map((project, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-slate-900">{project.name}</h3>
                      {project.description && (
                        <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                      )}
                      {project.technologies && project.technologies.length > 0 && (
                        <p className="text-xs text-gray-600 mt-2">
                          <span className="font-semibold">Technologies:</span> {project.technologies.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {hasContent(resume.education) && (
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-300 pb-2 mb-4">
                  Education
                </h2>
                <div className="space-y-4">
                  {resume.education.map((edu, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-slate-900">
                          {edu.degree} {edu.field && `in ${edu.field}`}
                        </h3>
                        {edu.startDate && (
                          <span className="text-sm text-gray-600">
                            {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700">{edu.institution}</p>
                      {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="border-l-2 border-slate-300 pl-6 space-y-8">
            {/* Skills */}
            {hasContent(resume.skills) && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3">Core Competencies</h3>
                <div className="space-y-4">
                  {resume.skills.map((skillCategory, index) => (
                    <div key={index}>
                      {skillCategory.category && (
                        <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">{skillCategory.category}</h4>
                      )}
                      <div className="space-y-1">
                        {skillCategory.items?.map((skill, i) => (
                          <p key={i} className="text-sm text-gray-700">• {skill}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {resume.personalInfo && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3">Links</h3>
                <div className="space-y-2 text-sm">
                  {resume.personalInfo.linkedin && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Linkedin className="w-4 h-4" />
                      <span className="truncate">{resume.personalInfo.linkedin}</span>
                    </div>
                  )}
                  {resume.personalInfo.github && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Github className="w-4 h-4" />
                      <span className="truncate">{resume.personalInfo.github}</span>
                    </div>
                  )}
                  {resume.personalInfo.portfolio && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Globe className="w-4 h-4" />
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

export default ExecutiveTemplate;
