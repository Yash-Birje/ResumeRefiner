import { useState } from 'react';
import { ChevronDown, ChevronUp, Code, Plus, Sparkles } from 'lucide-react';
import SkillCategory from './SkillCategory';

const SkillsSection = ({ data = [], targetRole, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAddCategory = () => {
    const newCategory = {
      category: '',
      items: []
    };

    onUpdate([...data, newCategory]);
  };

  const handleUpdateCategory = (categoryIndex, updates) => {
    const updated = [...data];
    updated[categoryIndex] = { ...updated[categoryIndex], ...updates };
    onUpdate(updated);
  };

  const handleDeleteCategory = (categoryIndex) => {
    onUpdate(data.filter((_, i) => i !== categoryIndex));
  };

  const handleGetAISuggestions = () => {
    // TODO: Implement AI skill suggestions
    console.log('Get AI skill suggestions for role:', targetRole);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Code className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">
            Skills {data.length > 0 && `(${data.reduce((sum, cat) => sum + (cat.items?.length || 0), 0)})`}
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
          {/* AI Suggestions Button */}
          <button
            onClick={handleGetAISuggestions}
            disabled={!targetRole}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={!targetRole ? 'Please set a target role first' : 'Get AI-powered skill suggestions'}
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Get AI Skill Suggestions</span>
          </button>

          {/* Add Category Button */}
          <button
            onClick={handleAddCategory}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Category</span>
          </button>

          {/* Skill Categories */}
          {data.map((category, index) => (
            <SkillCategory
              key={index}
              data={category}
              index={index}
              onUpdate={(updates) => handleUpdateCategory(index, updates)}
              onDelete={() => handleDeleteCategory(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
