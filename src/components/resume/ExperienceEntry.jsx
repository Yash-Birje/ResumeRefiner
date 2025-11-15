import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Plus, X, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { validateDateRange } from '../../utils/validation';
import { VALIDATION_RULES } from '../../utils/constants';
// import { improveBullet } from '../../api/geminiService';
import Modal from '../shared/Modal';

const ExperienceEntry = ({ data, index, targetRole, onUpdate, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const [errors, setErrors] = useState({});
  // const [improvingBullet, setImprovingBullet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [originalBullet, setOriginalBullet] = useState('');
  const [improvedBullet, setImprovedBullet] = useState('');
  const [currentBulletIndex, setCurrentBulletIndex] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    onUpdate({ [field]: value });

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCurrentToggle = (checked) => {
    onUpdate({
      current: checked,
      endDate: checked ? 'present' : ''
    });
  };

  const handleBlur = (field) => {
    const newErrors = {};

    if (field === 'company' && !data.company) {
      newErrors.company = 'Company name is required';
    }

    if (field === 'position' && !data.position) {
      newErrors.position = 'Position is required';
    }

    if ((field === 'startDate' || field === 'endDate') && data.startDate && data.endDate) {
      const validation = validateDateRange(data.startDate, data.endDate);
      if (!validation.isValid) {
        newErrors.dateRange = validation.error;
      }
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
  };

  // Bullet point handlers
  const handleAddBullet = () => {
    if (data.description.length < VALIDATION_RULES.MAX_BULLETS_PER_JOB) {
      onUpdate({ description: [...data.description, ''] });
    }
  };

  const handleUpdateBullet = (bulletIndex, value) => {
    const updated = [...data.description];
    updated[bulletIndex] = value;
    onUpdate({ description: updated });
  };

  const handleDeleteBullet = (bulletIndex) => {
    if (data.description.length > 1) {
      onUpdate({ description: data.description.filter((_, i) => i !== bulletIndex) });
    }
  };

  const handleImproveBullet = async (bulletIndex) => {
    const bulletText = data.description[bulletIndex];
    if (!bulletText.trim()) return;

    setError('');
    setImprovingBullet(bulletIndex);
    setCurrentBulletIndex(bulletIndex);
    setOriginalBullet(bulletText);

    try {
      const result = await improveBullet(bulletText, data.position, targetRole);

      if (result.success) {
        setImprovedBullet(result.improvedBullet);
        setShowModal(true);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to improve bullet. Please try again.');
    } finally {
      setImprovingBullet(null);
    }
  };

  const handleUseImproved = () => {
    const updated = [...data.description];
    updated[currentBulletIndex] = improvedBullet;
    onUpdate({ description: updated });
    handleCloseModal();
  };

  const handleTryAgain = async () => {
    setShowModal(false);
    await handleImproveBullet(currentBulletIndex);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setOriginalBullet('');
    setImprovedBullet('');
    setCurrentBulletIndex(null);
  };

  const getHeaderText = () => {
    if (data.position && data.company) {
      return `${data.position} at ${data.company}`;
    }
    if (data.position) return data.position;
    if (data.company) return data.company;
    return `Experience ${index + 1}`;
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
          title="Delete experience"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Entry Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Company and Position */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.company || ''}
                onChange={(e) => handleChange('company', e.target.value)}
                onBlur={() => handleBlur('company')}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.company ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Company Name"
              />
              {errors.company && (
                <p className="mt-1 text-xs text-red-600">{errors.company}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.position || ''}
                onChange={(e) => handleChange('position', e.target.value)}
                onBlur={() => handleBlur('position')}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.position ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Job Title"
              />
              {errors.position && (
                <p className="mt-1 text-xs text-red-600">{errors.position}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={data.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="City, State"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="month"
                value={data.startDate || ''}
                onChange={(e) => handleChange('startDate', e.target.value)}
                onBlur={() => handleBlur('startDate')}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="month"
                value={data.current ? '' : data.endDate || ''}
                onChange={(e) => handleChange('endDate', e.target.value)}
                onBlur={() => handleBlur('endDate')}
                disabled={data.current}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Currently Working Here Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`current-${data.id}`}
              checked={data.current || false}
              onChange={(e) => handleCurrentToggle(e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor={`current-${data.id}`} className="ml-2 text-sm text-gray-700">
              I currently work here
            </label>
          </div>

          {/* Date Range Error */}
          {errors.dateRange && (
            <p className="text-xs text-red-600">{errors.dateRange}</p>
          )}

          {/* Bullet Points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Achievements & Responsibilities
            </label>

            {/* Error Message */}
            {error && (
              <div className="mb-3 flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              {data.description?.map((bullet, bulletIndex) => (
                <div key={bulletIndex} className="flex items-start space-x-2">
                  <textarea
                    value={bullet}
                    onChange={(e) => handleUpdateBullet(bulletIndex, e.target.value)}
                    rows={2}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Describe your achievement or responsibility..."
                  />

                  {/* <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => handleImproveBullet(bulletIndex)}
                      className="p-2 text-primary hover:bg-primary/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Improve with AI"
                    >
                      {improvingBullet === bulletIndex ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                    </button>

                    {data.description.length > 1 && (
                      <button
                        onClick={() => handleDeleteBullet(bulletIndex)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete bullet"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div> */}
                </div>
              ))}
            </div>

            {/* Add Bullet Button */}
            {data.description.length < VALIDATION_RULES.MAX_BULLETS_PER_JOB && (
              <button
                onClick={handleAddBullet}
                className="mt-2 flex items-center space-x-1 text-sm text-primary hover:text-primary-dark"
              >
                <Plus className="w-4 h-4" />
                <span>Add Bullet Point</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* AI Improved Bullet Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="AI-Improved Bullet Point"
        size="lg"
      >
        <div className="space-y-4">
          {/* Improved Version */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Improved Version:</h3>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-gray-800 leading-relaxed">{improvedBullet}</p>
            </div>
          </div>

          {/* Original Version */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Original Version:</h3>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-800 leading-relaxed">{originalBullet}</p>
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

export default ExperienceEntry;
