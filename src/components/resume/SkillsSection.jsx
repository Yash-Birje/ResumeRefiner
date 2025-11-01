import { useState } from 'react';
import { ChevronDown, ChevronUp, Code, Plus, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import SkillCategory from './SkillCategory';
import { suggestSkills } from '../../api/geminiService';
import Modal from '../shared/Modal';

const SkillsSection = ({ data = [], targetRole, existingSkills, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [error, setError] = useState('');

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

  const handleGetAISuggestions = async () => {
    setError('');
    setIsGenerating(true);

    try {
      const result = await suggestSkills(targetRole, existingSkills);

      if (result.success) {
        setSuggestedSkills(result.skills);
        setSelectedSkills(result.skills.map(() => true)); // Select all by default
        setShowModal(true);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to get skill suggestions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleSkill = (index) => {
    const updated = [...selectedSkills];
    updated[index] = !updated[index];
    setSelectedSkills(updated);
  };

  const handleAddSelectedSkills = () => {
    const skillsToAdd = suggestedSkills.filter((_, index) => selectedSkills[index]);

    if (skillsToAdd.length === 0) {
      setShowModal(false);
      return;
    }

    // Find or create "AI Suggested" category
    const aiCategoryIndex = data.findIndex(cat => cat.category === 'AI Suggested');

    if (aiCategoryIndex >= 0) {
      // Add to existing category
      const updated = [...data];
      const existingItems = updated[aiCategoryIndex].items || [];
      updated[aiCategoryIndex].items = [...existingItems, ...skillsToAdd];
      onUpdate(updated);
    } else {
      // Create new category
      const newCategory = {
        category: 'AI Suggested',
        items: skillsToAdd
      };
      onUpdate([...data, newCategory]);
    }

    setShowModal(false);
    setSuggestedSkills([]);
    setSelectedSkills([]);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSuggestedSkills([]);
    setSelectedSkills([]);
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
          {/* Error Message */}
          {error && (
            <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* AI Suggestions Button */}
          <button
            onClick={handleGetAISuggestions}
            disabled={!targetRole || isGenerating}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={!targetRole ? 'Please set a target role first' : 'Get AI-powered skill suggestions'}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-medium">Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">Get AI Skill Suggestions</span>
              </>
            )}
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

      {/* AI Skill Suggestions Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="AI-Suggested Skills"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Select the skills you want to add to your resume:
          </p>

          {/* Skill Checkboxes */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {suggestedSkills.map((skill, index) => (
              <label
                key={index}
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedSkills[index]}
                  onChange={() => handleToggleSkill(index)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-900">{skill}</span>
              </label>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <button
              onClick={() => setSelectedSkills(suggestedSkills.map(() => true))}
              className="text-sm text-primary hover:underline"
            >
              Select All
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSelectedSkills}
                disabled={selectedSkills.every(s => !s)}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Selected ({selectedSkills.filter(s => s).length})
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SkillsSection;
