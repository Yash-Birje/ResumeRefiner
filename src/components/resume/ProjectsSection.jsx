import { useState } from 'react';
import { ChevronDown, ChevronUp, FolderGit2, Plus } from 'lucide-react';
import ProjectEntry from './ProjectEntry';

const ProjectsSection = ({ data = [], targetRole, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAddProject = () => {
    const newProject = {
      id: crypto.randomUUID ? crypto.randomUUID() : `proj-${Date.now()}`,
      name: '',
      description: '',
      technologies: [],
      link: '',
      highlights: ['']
    };

    onUpdate([...data, newProject]);
  };

  const handleUpdateProject = (id, updates) => {
    onUpdate(data.map(proj => proj.id === id ? { ...proj, ...updates } : proj));
  };

  const handleDeleteProject = (id) => {
    onUpdate(data.filter(proj => proj.id !== id));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <FolderGit2 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">
            Projects {data.length > 0 && `(${data.length})`}
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {/* Section Content */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-200 space-y-4">
          {/* Add Project Button */}
          <button
            onClick={handleAddProject}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Project</span>
          </button>

          {/* Project Entries */}
          {data.map((project, index) => (
            <ProjectEntry
              key={project.id}
              data={project}
              index={index}
              targetRole={targetRole}
              onUpdate={(updates) => handleUpdateProject(project.id, updates)}
              onDelete={() => handleDeleteProject(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;
