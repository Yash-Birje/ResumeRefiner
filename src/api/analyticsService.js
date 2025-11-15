import { calculateResumeAnalytics } from '../utils/analyticsCalculator';
import { getResumeById } from './resumeService';

/**
 * Get analytics for a specific resume
 * @param {string} resumeId - Resume ID
 * @returns {Object} Analytics data
 */
export const getResumeAnalytics = async (resumeId) => {
  try {
    const resume = getResumeById(resumeId);
    // console.log('Fetched resume for analytics:', resume);
    if (!resume) {
      return {
        success: false,
        error: 'Resume not found'
      };
    }

    const analytics = await calculateResumeAnalytics(resume);
    // console.log('Calculated analytics for resume:', analytics);
    return {
      success: true,
      resumeId,
      resumeTitle: resume.title,
      targetRole: resume.targetRole,
      analytics
    };
  } catch (error) {
    console.error('Error calculating analytics:', error);
    return {
      success: false,
      error: 'Failed to calculate analytics'
    };
  }
};

/**
 * Get suggestions based on analytics
 * @param {Object} analytics - Analytics data from calculateResumeAnalytics
 * @returns {Array} Array of suggestion objects
 */
export const getAnalyticsSuggestions = (analytics) => {
  const suggestions = [];

  if (!analytics) return suggestions;
  // console.log('Generating suggestions based on analytics:', analytics);
  // Check action verb usage
  if (analytics.actionVerbs.percentage < 70) {
    suggestions.push({
      type: 'warning',
      category: 'Action Verbs',
      message: `Only ${analytics.actionVerbs.percentage}% of your bullet points start with action verbs.`,
      suggestion: 'Start each bullet point with a strong action verb to demonstrate your impact.',
      priority: 'high'
    });
  }

  // Check quantifiable achievements
  if (analytics.quantifiable.percentage < 40) {
    suggestions.push({
      type: 'warning',
      category: 'Quantifiable Results',
      message: `Only ${analytics.quantifiable.percentage}% of your achievements include numbers or metrics.`,
      suggestion: 'Add specific numbers, percentages, or metrics to demonstrate measurable impact.',
      priority: 'high'
    });
  }

  // Check impact words
  if (analytics.impactWords.percentage < 50) {
    suggestions.push({
      type: 'info',
      category: 'Impact Words',
      message: `${analytics.impactWords.percentage}% of your bullets include result-oriented words.`,
      suggestion: 'Use more impact words like "increased", "reduced", "improved" to show results.',
      priority: 'medium'
    });
  }

  // Check section completeness
  if (analytics.completeness.overall.percentage < 100) {
    const incompleteSections = Object.entries(analytics.completeness.sections)
      .filter(([_, section]) => section.percentage < 100)
      .map(([_, section]) => section.name);

    if (incompleteSections.length > 0) {
      suggestions.push({
        type: 'info',
        category: 'Completeness',
        message: `Your resume is ${analytics.completeness.overall.percentage}% complete.`,
        suggestion: `Complete these sections: ${incompleteSections.join(', ')}`,
        priority: 'medium'
      });
    }
  }

  // Check word count
  if (analytics.wordCount < 200) {
    suggestions.push({
      type: 'warning',
      category: 'Content Length',
      message: `Your resume has ${analytics.wordCount} words, which may be too brief.`,
      suggestion: 'Add more detail to your experience and achievements to reach 300-500 words.',
      priority: 'medium'
    });
  } else if (analytics.wordCount > 600) {
    suggestions.push({
      type: 'info',
      category: 'Content Length',
      message: `Your resume has ${analytics.wordCount} words, which may be too long.`,
      suggestion: 'Consider condensing your content to keep it concise and impactful.',
      priority: 'low'
    });
  }

  // Check bullet points
  if (analytics.actionVerbs.totalBullets === 0) {
    suggestions.push({
      type: 'error',
      category: 'Content',
      message: 'Your resume has no bullet points in experience or projects.',
      suggestion: 'Add detailed descriptions of your work and achievements.',
      priority: 'critical'
    });
  } else if (analytics.actionVerbs.totalBullets < 5) {
    suggestions.push({
      type: 'warning',
      category: 'Content',
      message: 'Your resume has very few bullet points.',
      suggestion: 'Add more detail about your accomplishments and responsibilities.',
      priority: 'high'
    });
  }

  return suggestions;
};

/**
 * Get score rating based on analytics score
 * @param {number} score - Analytics score (0-100)
 * @returns {Object} Rating information
 */
export const getScoreRating = (score) => {
  if (score >= 90) {
    return {
      rating: 'Excellent',
      color: 'green',
      message: 'Your resume is in great shape! Keep up the excellent work.'
    };
  } else if (score >= 75) {
    return {
      rating: 'Good',
      color: 'blue',
      message: 'Your resume is looking good. A few improvements could make it even better.'
    };
  } else if (score >= 60) {
    return {
      rating: 'Fair',
      color: 'yellow',
      message: 'Your resume needs some improvements. Focus on the suggestions below.'
    };
  } else if (score >= 40) {
    return {
      rating: 'Needs Work',
      color: 'orange',
      message: 'Your resume needs significant improvements. Review the suggestions carefully.'
    };
  } else {
    return {
      rating: 'Poor',
      color: 'red',
      message: 'Your resume requires major improvements. Start by completing all sections.'
    };
  }
};

/**
 * Export analytics data for download
 * @param {Object} analyticsData - Full analytics data
 * @returns {string} JSON string for download
 */
export const exportAnalyticsData = (analyticsData) => {
  return JSON.stringify(analyticsData, null, 2);
};
