import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Sparkles } from 'lucide-react';
import { VALIDATION_RULES } from '../../utils/constants';

const SummarySection = ({ data, targetRole, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const charCount = data?.length || 0;
  const maxChars = VALIDATION_RULES.SUMMARY.max;

  const handleChange = (value) => {
    if (value.length <= maxChars) {
      onUpdate(value);
    }
  };

  const handleGenerateAI = () => {
    // TODO: Implement AI generation
    console.log('Generate AI summary for role:', targetRole);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Professional Summary</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {/* Section Content */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Summary
              </label>
              <button
                onClick={handleGenerateAI}
                disabled={!targetRole}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={!targetRole ? 'Please set a target role first' : 'Generate with AI'}
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate with AI</span>
              </button>
            </div>

            <textarea
              value={data || ''}
              onChange={(e) => handleChange(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Write a brief professional summary highlighting your experience, skills, and career objectives..."
            />

            {/* Character Counter */}
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500">
                A strong summary is 2-4 sentences highlighting your key qualifications
              </p>
              <span className={`text-xs ${
                charCount > maxChars * 0.9 ? 'text-red-600' : 'text-gray-500'
              }`}>
                {charCount} / {maxChars}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummarySection;
