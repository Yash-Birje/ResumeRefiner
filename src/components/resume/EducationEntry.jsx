import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Plus, X } from 'lucide-react';
import { validateDateRange, validateGPA } from '../../utils/validation';
import { VALIDATION_RULES } from '../../utils/constants';

const EducationEntry = ({ data, index, onUpdate, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    onUpdate({ [field]: value });

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field) => {
    const newErrors = {};

    if (field === 'institution' && !data.institution) {
      newErrors.institution = 'Institution is required';
    }

    if (field === 'degree' && !data.degree) {
      newErrors.degree = 'Degree is required';
    }

    if (field === 'field' && !data.field) {
      newErrors.field = 'Field of study is required';
    }

    if ((field === 'startDate' || field === 'endDate') && data.startDate && data.endDate) {
      const validation = validateDateRange(data.startDate, data.endDate);
      if (!validation.isValid) {
        newErrors.dateRange = validation.error;
      }
    }

    if (field === 'gpa' && data.gpa) {
      const validation = validateGPA(data.gpa, false);
      if (!validation.isValid) {
        newErrors.gpa = validation.error;
      }
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
  };

  const handleAddAchievement = () => {
    if (!data.achievements) {
      onUpdate({ achievements: [''] });
    } else if (data.achievements.length < VALIDATION_RULES.MAX_ACHIEVEMENTS) {
      onUpdate({ achievements: [...data.achievements, ''] });
    }
  };

  const handleUpdateAchievement = (achievementIndex, value) => {
    const updated = [...(data.achievements || [])];
    updated[achievementIndex] = value;
    onUpdate({ achievements: updated });
  };

  const handleDeleteAchievement = (achievementIndex) => {
    onUpdate({ achievements: data.achievements.filter((_, i) => i !== achievementIndex) });
  };

  const getHeaderText = () => {
    if (data.degree && data.field) {
      return `${data.degree} in ${data.field}`;
    }
    if (data.degree) return data.degree;
    if (data.institution) return data.institution;
    return `Education ${index + 1}`;
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
          title="Delete education"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Entry Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Institution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Institution <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.institution || ''}
              onChange={(e) => handleChange('institution', e.target.value)}
              onBlur={() => handleBlur('institution')}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.institution ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="University Name"
            />
            {errors.institution && (
              <p className="mt-1 text-xs text-red-600">{errors.institution}</p>
            )}
          </div>

          {/* Degree and Field */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.degree || ''}
                onChange={(e) => handleChange('degree', e.target.value)}
                onBlur={() => handleBlur('degree')}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.degree ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Bachelor of Science"
              />
              {errors.degree && (
                <p className="mt-1 text-xs text-red-600">{errors.degree}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field of Study <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.field || ''}
                onChange={(e) => handleChange('field', e.target.value)}
                onBlur={() => handleBlur('field')}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.field ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Computer Science"
              />
              {errors.field && (
                <p className="mt-1 text-xs text-red-600">{errors.field}</p>
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

          {/* Dates and GPA */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                value={data.endDate || ''}
                onChange={(e) => handleChange('endDate', e.target.value)}
                onBlur={() => handleBlur('endDate')}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GPA
              </label>
              <input
                type="text"
                value={data.gpa || ''}
                onChange={(e) => handleChange('gpa', e.target.value)}
                onBlur={() => handleBlur('gpa')}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.gpa ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="3.8"
              />
              {errors.gpa && (
                <p className="mt-1 text-xs text-red-600">{errors.gpa}</p>
              )}
            </div>
          </div>

          {errors.dateRange && (
            <p className="text-xs text-red-600">{errors.dateRange}</p>
          )}

          {/* Achievements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Achievements (Optional)
            </label>

            {data.achievements && data.achievements.length > 0 && (
              <div className="space-y-2 mb-2">
                {data.achievements.map((achievement, achievementIndex) => (
                  <div key={achievementIndex} className="flex items-start space-x-2">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => handleUpdateAchievement(achievementIndex, e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Dean's List, Scholarship, Leadership role..."
                    />

                    <button
                      onClick={() => handleDeleteAchievement(achievementIndex)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete achievement"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {(!data.achievements || data.achievements.length < VALIDATION_RULES.MAX_ACHIEVEMENTS) && (
              <button
                onClick={handleAddAchievement}
                className="flex items-center space-x-1 text-sm text-primary hover:text-primary-dark"
              >
                <Plus className="w-4 h-4" />
                <span>Add Achievement</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationEntry;
