import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Plus, X, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { validateURL } from '../../utils/validation';
import { VALIDATION_RULES } from '../../utils/constants';
// import { improveBullet } from '../../api/geminiService';
import Modal from '../shared/Modal';

const ProjectEntry = ({ data, index, targetRole, onUpdate, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const [errors, setErrors] = useState({});
  const [newTech, setNewTech] = useState('');
  const [improvingHighlight, setImprovingHighlight] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [originalHighlight, setOriginalHighlight] = useState('');
  const [improvedHighlight, setImprovedHighlight] = useState('');
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    onUpdate({ [field]: value });

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field) => {
    const newErrors = {};

    if (field === 'name' && !data.name) {
      newErrors.name = 'Project name is required';
    }

    if (field === 'description' && !data.description) {
      newErrors.description = 'Description is required';
    }

    if (field === 'link' && data.link) {
      const validation = validateURL(data.link, false);
      if (!validation.isValid) {
        newErrors.link = validation.error;
      }
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
  };

  // Technology handlers
  const handleAddTechnology = () => {
    if (newTech.trim() && data.technologies.length < VALIDATION_RULES.MAX_TECHNOLOGIES) {
      onUpdate({ technologies: [...data.technologies, newTech.trim()] });
      setNewTech('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTechnology();
    }
  };

  const handleDeleteTechnology = (techIndex) => {
    onUpdate({ technologies: data.technologies.filter((_, i) => i !== techIndex) });
  };

  // Highlight handlers
  const handleAddHighlight = () => {
    if (data.highlights.length < VALIDATION_RULES.MAX_BULLETS_PER_PROJECT) {
      onUpdate({ highlights: [...data.highlights, ''] });
    }
  };

  const handleUpdateHighlight = (highlightIndex, value) => {
    const updated = [...data.highlights];
    updated[highlightIndex] = value;
    onUpdate({ highlights: updated });
  };

  const handleDeleteHighlight = (highlightIndex) => {
    if (data.highlights.length > 1) {
      onUpdate({ highlights: data.highlights.filter((_, i) => i !== highlightIndex) });
    }
  };

  const handleImproveHighlight = async (highlightIndex) => {
    const highlightText = data.highlights[highlightIndex];
    if (!highlightText.trim()) return;

    setError('');
    setImprovingHighlight(highlightIndex);
    setCurrentHighlightIndex(highlightIndex);
    setOriginalHighlight(highlightText);

    try {
      const result = await improveBullet(highlightText, `${data.name} project`, targetRole);

      if (result.success) {
        setImprovedHighlight(result.improvedBullet);
        setShowModal(true);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to improve highlight. Please try again.');
    } finally {
      setImprovingHighlight(null);
    }
  };

  const handleUseImproved = () => {
    const updated = [...data.highlights];
    updated[currentHighlightIndex] = improvedHighlight;
    onUpdate({ highlights: updated });
    handleCloseModal();
  };

  const handleTryAgain = async () => {
    setShowModal(false);
    await handleImproveHighlight(currentHighlightIndex);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setOriginalHighlight('');
    setImprovedHighlight('');
    setCurrentHighlightIndex(null);
  };

  const getHeaderText = () => {
    return data.name || `Project ${index + 1}`;
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Entry Header */}
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 flex-1 text-left"
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
          <span className="font-medium text-gray-900 text-sm">{getHeaderText()}</span>
        </button>

        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
          title="Delete project"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Entry Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="E-commerce Platform"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={data.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              rows={2}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Brief overview of the project..."
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technologies
            </label>

            {/* Technology Tags */}
            {data.technologies && data.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {data.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                  >
                    <span>{tech}</span>
                    <button
                      onClick={() => handleDeleteTechnology(techIndex)}
                      className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add Technology Input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Type technology and press Enter"
              />

              <button
                onClick={handleAddTechnology}
                disabled={!newTech.trim() || data.technologies.length >= VALIDATION_RULES.MAX_TECHNOLOGIES}
                className="p-2 text-primary hover:bg-primary/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Add technology"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Project Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Link
            </label>
            <input
              type="text"
              value={data.link || ''}
              onChange={(e) => handleChange('link', e.target.value)}
              onBlur={() => handleBlur('link')}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.link ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="github.com/username/project"
            />
            {errors.link && (
              <p className="mt-1 text-xs text-red-600">{errors.link}</p>
            )}
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Highlights
            </label>

            {/* Error Message */}
            {error && (
              <div className="mb-3 flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              {data.highlights?.map((highlight, highlightIndex) => (
                <div key={highlightIndex} className="flex items-start space-x-2">
                  <textarea
                    value={highlight}
                    onChange={(e) => handleUpdateHighlight(highlightIndex, e.target.value)}
                    rows={2}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Describe a key achievement or feature..."
                  />

                  {/* <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => handleImproveHighlight(highlightIndex)}
                      className="p-2 text-primary hover:bg-primary/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Improve with AI"
                    >
                      {improvingHighlight === highlightIndex ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                    </button>

                    {data.highlights.length > 1 && (
                      <button
                        onClick={() => handleDeleteHighlight(highlightIndex)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete highlight"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div> */}
                </div>
              ))}
            </div>

            {/* Add Highlight Button */}
            {data.highlights.length < VALIDATION_RULES.MAX_BULLETS_PER_PROJECT && (
              <button
                onClick={handleAddHighlight}
                className="mt-2 flex items-center space-x-1 text-sm text-primary hover:text-primary-dark"
              >
                <Plus className="w-4 h-4" />
                <span>Add Highlight</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* AI Improved Highlight Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="AI-Improved Highlight"
        size="lg"
      >
        <div className="space-y-4">
          {/* Improved Version */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Improved Version:</h3>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-gray-800 leading-relaxed">{improvedHighlight}</p>
            </div>
          </div>

          {/* Original Version */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Original Version:</h3>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-800 leading-relaxed">{originalHighlight}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Keep Original
            </button>
            <button
              onClick={handleTryAgain}
              className="px-4 py-2 text-sm font-medium text-primary bg-white border border-primary rounded-lg hover:bg-primary/10 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleUseImproved}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
            >
              Use Improved
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectEntry;
