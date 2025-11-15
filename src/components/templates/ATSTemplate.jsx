import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { format } from 'date-fns';

const ATSTemplate = ({ resume }) => {
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
    <div className="min-h-full bg-white p-8" style={{ fontFamily: '"Arial", sans-serif', color: '#000' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pb-4 border-b-2 border-black">
          <h1 className="text-3xl font-bold">
            {resume.personalInfo?.fullName || 'YOUR NAME'}
          </h1>
          {resume.targetRole && (
            <p className="text-lg font-semibold mt-1">{resume.targetRole}</p>
          )}
          <div className="flex justify-center gap-4 mt-3 text-sm flex-wrap">
            {resume.personalInfo?.email && <span>{resume.personalInfo.email}</span>}
            {resume.personalInfo?.phone && <span>|</span>}
            {resume.personalInfo?.phone && <span>{resume.personalInfo.phone}</span>}
            {resume.personalInfo?.location && <span>|</span>}
            {resume.personalInfo?.location && <span>{resume.personalInfo.location}</span>}
            {resume.personalInfo?.linkedin && <span>|</span>}
            {resume.personalInfo?.linkedin && <span>{resume.personalInfo.linkedin}</span>}
          </div>
        </div>

        {/* Professional Summary */}
        {resume.summary && (
          <div className="mb-4">
            <h2 className="text-lg font-bold uppercase border-b border-black pb-1 mb-2">
              Professional Summary
            </h2>
            <p className="text-sm leading-relaxed">{resume.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {hasContent(resume.experience) && (
          <div className="mb-4">
            <h2 className="text-lg font-bold uppercase border-b border-black pb-1 mb-2">
              Professional Experience
            </h2>
            <div className="space-y-3">
              {resume.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-bold">{exp.position}</p>
                      <p className="font-semibold">{exp.company}</p>
                    </div>
                    <div className="text-right text-sm">
                      {exp.startDate && (
                        <p>{formatDate(exp.startDate)} - {formatDate(exp.endDate || (exp.current ? 'present' : ''))}</p>
                      )}
                      {exp.location && <p>{exp.location}</p>}
                    </div>
                  </div>
                  {exp.description && exp.description.length > 0 && (
                    <ul className="list-disc list-inside ml-2 mt-1 text-sm space-y-0.5">
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

        {/* Education */}
        {hasContent(resume.education) && (
          <div className="mb-4">
            <h2 className="text-lg font-bold uppercase border-b border-black pb-1 mb-2">
              Education
            </h2>
            <div className="space-y-2">
              {resume.education.map((edu, index) => (
                <div key={index} className="text-sm">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-bold">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                      <p className="font-semibold">{edu.institution}</p>
                    </div>
                    <div className="text-right">
                      {edu.startDate && (
                        <p>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                      )}
                      {edu.gpa && <p>GPA: {edu.gpa}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {hasContent(resume.skills) && (
          <div className="mb-4">
            <h2 className="text-lg font-bold uppercase border-b border-black pb-1 mb-2">
              Skills
            </h2>
            <div className="space-y-2">
              {resume.skills.map((skillCategory, index) => (
                <div key={index} className="text-sm">
                  {skillCategory.category && (
                    <span className="font-semibold">{skillCategory.category}: </span>
                  )}
                  <span>{skillCategory.items?.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {hasContent(resume.projects) && (
          <div className="mb-4">
            <h2 className="text-lg font-bold uppercase border-b border-black pb-1 mb-2">
              Projects
            </h2>
            <div className="space-y-2">
              {resume.projects.map((project, index) => (
                <div key={index} className="text-sm">
                  <p className="font-bold">{project.name}</p>
                  {project.description && <p>{project.description}</p>}
                  {project.technologies && project.technologies.length > 0 && (
                    <p className="text-xs">Technologies: {project.technologies.join(', ')}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Links */}
        {resume.personalInfo?.github || resume.personalInfo?.portfolio ? (
          <div className="text-sm border-t border-black pt-2">
            {resume.personalInfo?.github && (
              <p>GitHub: {resume.personalInfo.github}</p>
            )}
            {resume.personalInfo?.portfolio && (
              <p>Portfolio: {resume.personalInfo.portfolio}</p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ATSTemplate;
