import { useState } from 'react';
import { ChevronDown, ChevronUp, Briefcase, Plus } from 'lucide-react';
import ExperienceEntry from './ExperienceEntry';

const ExperienceSection = ({ data = [], targetRole, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAddExperience = () => {
    const newExperience = {
      id: crypto.randomUUID ? crypto.randomUUID() : `exp-${Date.now()}`,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ['']
    };

    onUpdate([...data, newExperience]);
  };

  const handleUpdateExperience = (id, updates) => {
    onUpdate(data.map(exp => exp.id === id ? { ...exp, ...updates } : exp));
  };

  const handleDeleteExperience = (id) => {
    onUpdate(data.filter(exp => exp.id !== id));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Briefcase className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">
            Work Experience {data.length > 0 && `(${data.length})`}
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
          {/* Add Experience Button */}
          <button
            onClick={handleAddExperience}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Experience</span>
          </button>

          {/* Experience Entries */}
          {data.map((experience, index) => (
            <ExperienceEntry
              key={experience.id}
              data={experience}
              index={index}
              targetRole={targetRole}
              onUpdate={(updates) => handleUpdateExperience(experience.id, updates)}
              onDelete={() => handleDeleteExperience(experience.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceSection;
