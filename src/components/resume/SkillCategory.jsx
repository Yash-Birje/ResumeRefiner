import { useState } from 'react';
import { X, Plus } from 'lucide-react';

const SkillCategory = ({ data, index, onUpdate, onDelete }) => {
  const [newSkill, setNewSkill] = useState('');

  const handleCategoryChange = (value) => {
    onUpdate({ category: value });
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      onUpdate({ items: [...(data.items || []), newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleDeleteSkill = (skillIndex) => {
    onUpdate({ items: data.items.filter((_, i) => i !== skillIndex) });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      {/* Category Header */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={data.category || ''}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="flex-1 px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="e.g., Frontend, Backend, Tools, Soft Skills"
        />

        <button
          onClick={onDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Delete category"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Skill Tags */}
      {data.items && data.items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.items.map((skill, skillIndex) => (
            <span
              key={skillIndex}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
            >
              <span>{skill}</span>
              <button
                onClick={() => handleDeleteSkill(skillIndex)}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Add Skill Input */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Type skill and press Enter"
        />

        <button
          onClick={handleAddSkill}
          disabled={!newSkill.trim()}
          className="p-2 text-primary hover:bg-primary/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Add skill"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SkillCategory;
