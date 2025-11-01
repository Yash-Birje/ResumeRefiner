import { useState } from 'react';
import { ChevronDown, ChevronUp, GraduationCap, Plus } from 'lucide-react';
import EducationEntry from './EducationEntry';

const EducationSection = ({ data = [], onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAddEducation = () => {
    const newEducation = {
      id: crypto.randomUUID ? crypto.randomUUID() : `edu-${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: []
    };

    onUpdate([...data, newEducation]);
  };

  const handleUpdateEducation = (id, updates) => {
    onUpdate(data.map(edu => edu.id === id ? { ...edu, ...updates } : edu));
  };

  const handleDeleteEducation = (id) => {
    onUpdate(data.filter(edu => edu.id !== id));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <GraduationCap className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">
            Education {data.length > 0 && `(${data.length})`}
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
          {/* Add Education Button */}
          <button
            onClick={handleAddEducation}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Education</span>
          </button>

          {/* Education Entries */}
          {data.map((education, index) => (
            <EducationEntry
              key={education.id}
              data={education}
              index={index}
              onUpdate={(updates) => handleUpdateEducation(education.id, updates)}
              onDelete={() => handleDeleteEducation(education.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationSection;
