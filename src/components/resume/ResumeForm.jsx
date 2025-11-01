import PersonalInfoSection from './PersonalInfoSection';
import SummarySection from './SummarySection';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import SkillsSection from './SkillsSection';
import ProjectsSection from './ProjectsSection';

const ResumeForm = ({ resume, onUpdate }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Personal Information */}
      <PersonalInfoSection
        data={resume.personalInfo}
        onUpdate={(personalInfo) => onUpdate({ personalInfo })}
      />

      {/* Professional Summary */}
      <SummarySection
        data={resume.summary}
        targetRole={resume.targetRole}
        personalInfo={resume.personalInfo}
        experience={resume.experience}
        education={resume.education}
        onUpdate={(summary) => onUpdate({ summary })}
      />

      {/* Work Experience */}
      <ExperienceSection
        data={resume.experience}
        targetRole={resume.targetRole}
        onUpdate={(experience) => onUpdate({ experience })}
      />

      {/* Education */}
      <EducationSection
        data={resume.education}
        onUpdate={(education) => onUpdate({ education })}
      />

      {/* Skills */}
      <SkillsSection
        data={resume.skills}
        targetRole={resume.targetRole}
        existingSkills={resume.skills}
        onUpdate={(skills) => onUpdate({ skills })}
      />

      {/* Projects */}
      <ProjectsSection
        data={resume.projects}
        targetRole={resume.targetRole}
        onUpdate={(projects) => onUpdate({ projects })}
      />
    </div>
  );
};

export default ResumeForm;
