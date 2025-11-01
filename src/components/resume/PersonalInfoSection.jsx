import { useState } from 'react';
import { ChevronDown, ChevronUp, User } from 'lucide-react';
import { validateEmail, validatePhone, validateURL } from '../../utils/validation';

const PersonalInfoSection = ({ data, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    onUpdate({ ...data, [field]: value });

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field) => {
    const newErrors = {};

    if (field === 'fullName' && !data.fullName) {
      newErrors.fullName = 'Full name is required';
    }

    if (field === 'email') {
      const validation = validateEmail(data.email);
      if (!validation.isValid) {
        newErrors.email = validation.error;
      }
    }

    if (field === 'phone' && data.phone) {
      const validation = validatePhone(data.phone, false);
      if (!validation.isValid) {
        newErrors.phone = validation.error;
      }
    }

    if (field === 'linkedin' && data.linkedin) {
      const validation = validateURL(data.linkedin, false);
      if (!validation.isValid) {
        newErrors.linkedin = validation.error;
      }
    }

    if (field === 'github' && data.github) {
      const validation = validateURL(data.github, false);
      if (!validation.isValid) {
        newErrors.github = validation.error;
      }
    }

    if (field === 'portfolio' && data.portfolio) {
      const validation = validateURL(data.portfolio, false);
      if (!validation.isValid) {
        newErrors.portfolio = validation.error;
      }
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
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
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.fullName || ''}
              onChange={(e) => handleChange('fullName', e.target.value)}
              onBlur={() => handleBlur('fullName')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          {/* Two-column grid for Email and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={data.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={data.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="San Francisco, CA"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn URL
            </label>
            <input
              type="text"
              value={data.linkedin || ''}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              onBlur={() => handleBlur('linkedin')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.linkedin ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="linkedin.com/in/johndoe"
            />
            {errors.linkedin && (
              <p className="mt-1 text-sm text-red-600">{errors.linkedin}</p>
            )}
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub URL
            </label>
            <input
              type="text"
              value={data.github || ''}
              onChange={(e) => handleChange('github', e.target.value)}
              onBlur={() => handleBlur('github')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.github ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="github.com/johndoe"
            />
            {errors.github && (
              <p className="mt-1 text-sm text-red-600">{errors.github}</p>
            )}
          </div>

          {/* Portfolio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio URL
            </label>
            <input
              type="text"
              value={data.portfolio || ''}
              onChange={(e) => handleChange('portfolio', e.target.value)}
              onBlur={() => handleBlur('portfolio')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.portfolio ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="johndoe.com"
            />
            {errors.portfolio && (
              <p className="mt-1 text-sm text-red-600">{errors.portfolio}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoSection;
