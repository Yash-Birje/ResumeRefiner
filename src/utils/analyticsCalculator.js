import { ACTION_VERBS, IMPACT_WORDS, ANALYTICS_THRESHOLDS } from './constants';

/**
 * Calculate word count for text content
 */
export const calculateWordCount = (text) => {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

/**
 * Calculate total word count across resume sections
 */
export const calculateTotalWordCount = (resume) => {
  let total = 0;

  // Summary
  if (resume.summary) {
    total += calculateWordCount(resume.summary);
  }

  // Experience descriptions
  if (resume.experience) {
    resume.experience.forEach(exp => {
      if (exp.description) {
        exp.description.forEach(bullet => {
          total += calculateWordCount(bullet);
        });
      }
    });
  }

  // Education achievements
  if (resume.education) {
    resume.education.forEach(edu => {
      if (edu.achievements) {
        edu.achievements.forEach(achievement => {
          total += calculateWordCount(achievement);
        });
      }
    });
  }

  // Project descriptions and highlights
  if (resume.projects) {
    resume.projects.forEach(project => {
      total += calculateWordCount(project.description);
      if (project.highlights) {
        project.highlights.forEach(highlight => {
          total += calculateWordCount(highlight);
        });
      }
    });
  }

  return total;
};

/**
 * Find action verbs in text
 */
export const findActionVerbs = (text) => {
  if (!text || typeof text !== 'string') return [];

  const words = text.toLowerCase().split(/\s+/);
  const found = [];

  ACTION_VERBS.forEach(verb => {
    const verbLower = verb.toLowerCase();
    if (words.some(word => word.startsWith(verbLower))) {
      found.push(verb);
    }
  });

  return found;
};

/**
 * Calculate action verb usage across resume
 */
export const calculateActionVerbUsage = (resume) => {
  const allBullets = [];
  const verbCounts = {};

  // Collect all bullet points from experience
  if (resume.experience) {
    resume.experience.forEach(exp => {
      if (exp.description) {
        allBullets.push(...exp.description);
      }
    });
  }

  // Collect highlights from projects
  if (resume.projects) {
    resume.projects.forEach(project => {
      if (project.highlights) {
        allBullets.push(...project.highlights);
      }
    });
  }

  // Count action verbs
  allBullets.forEach(bullet => {
    const verbs = findActionVerbs(bullet);
    verbs.forEach(verb => {
      verbCounts[verb] = (verbCounts[verb] || 0) + 1;
    });
  });

  const totalBullets = allBullets.length;
  const bulletsWithActionVerbs = allBullets.filter(bullet =>
    findActionVerbs(bullet).length > 0
  ).length;

  return {
    totalBullets,
    bulletsWithActionVerbs,
    percentage: totalBullets > 0 ? Math.round((bulletsWithActionVerbs / totalBullets) * 100) : 0,
    verbCounts,
    topVerbs: Object.entries(verbCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([verb, count]) => ({ verb, count }))
  };
};

/**
 * Detect numbers and quantifiable achievements
 */
export const detectQuantifiableMetrics = (text) => {
  if (!text || typeof text !== 'string') return false;

  // Patterns for numbers, percentages, dollar amounts, etc.
  const patterns = [
    /\d+%/,                    // Percentages: 25%
    /\$\d+/,                   // Dollar amounts: $1000
    /\d+\+/,                   // Numbers with plus: 50+
    /\d{1,3}(,\d{3})*/,       // Large numbers with commas: 1,000
    /\d+(\.\d+)?[KMB]/,       // K, M, B notation: 5K, 1.5M
    /\d+x/i,                   // Multipliers: 2x, 10x
    /\d+-\d+/,                 // Ranges: 10-15
    /\d+\s*(hours?|days?|weeks?|months?|years?)/i, // Time periods
  ];

  return patterns.some(pattern => pattern.test(text));
};

/**
 * Calculate quantifiable achievement metrics
 */
export const calculateQuantifiableAchievements = (resume) => {
  const allBullets = [];

  // Collect all bullet points
  if (resume.experience) {
    resume.experience.forEach(exp => {
      if (exp.description) {
        allBullets.push(...exp.description);
      }
    });
  }

  if (resume.projects) {
    resume.projects.forEach(project => {
      if (project.highlights) {
        allBullets.push(...project.highlights);
      }
    });
  }

  const totalBullets = allBullets.length;
  const quantifiableBullets = allBullets.filter(bullet =>
    detectQuantifiableMetrics(bullet)
  ).length;

  return {
    totalBullets,
    quantifiableBullets,
    percentage: totalBullets > 0 ? Math.round((quantifiableBullets / totalBullets) * 100) : 0
  };
};

/**
 * Find impact words in text
 */
export const findImpactWords = (text) => {
  if (!text || typeof text !== 'string') return [];

  const words = text.toLowerCase().split(/\s+/);
  const found = [];

  IMPACT_WORDS.forEach(impactWord => {
    const wordLower = impactWord.toLowerCase();
    if (words.some(word => word.startsWith(wordLower))) {
      found.push(impactWord);
    }
  });

  return found;
};

/**
 * Calculate impact word usage
 */
export const calculateImpactWordUsage = (resume) => {
  const allBullets = [];
  const impactWordCounts = {};

  // Collect all bullet points
  if (resume.experience) {
    resume.experience.forEach(exp => {
      if (exp.description) {
        allBullets.push(...exp.description);
      }
    });
  }

  if (resume.projects) {
    resume.projects.forEach(project => {
      if (project.highlights) {
        allBullets.push(...project.highlights);
      }
    });
  }

  // Count impact words
  allBullets.forEach(bullet => {
    const words = findImpactWords(bullet);
    words.forEach(word => {
      impactWordCounts[word] = (impactWordCounts[word] || 0) + 1;
    });
  });

  const totalBullets = allBullets.length;
  const bulletsWithImpactWords = allBullets.filter(bullet =>
    findImpactWords(bullet).length > 0
  ).length;

  return {
    totalBullets,
    bulletsWithImpactWords,
    percentage: totalBullets > 0 ? Math.round((bulletsWithImpactWords / totalBullets) * 100) : 0,
    impactWordCounts,
    topWords: Object.entries(impactWordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }))
  };
};

/**
 * Calculate section completeness
 */
export const calculateSectionCompleteness = (resume) => {
  const sections = {
    personalInfo: {
      name: 'Personal Information',
      required: ['fullName', 'email', 'phone'],
      optional: ['location', 'linkedin', 'github', 'portfolio'],
      completed: 0,
      total: 0
    },
    summary: {
      name: 'Professional Summary',
      completed: 0,
      total: 1
    },
    experience: {
      name: 'Work Experience',
      completed: 0,
      total: 1
    },
    education: {
      name: 'Education',
      completed: 0,
      total: 1
    },
    skills: {
      name: 'Skills',
      completed: 0,
      total: 1
    },
    projects: {
      name: 'Projects',
      completed: 0,
      total: 1
    }
  };

  // Personal Info
  const personalInfo = resume.personalInfo || {};
  const requiredFilled = sections.personalInfo.required.filter(
    field => personalInfo[field] && personalInfo[field].trim()
  ).length;
  const optionalFilled = sections.personalInfo.optional.filter(
    field => personalInfo[field] && personalInfo[field].trim()
  ).length;
  sections.personalInfo.completed = requiredFilled;
  sections.personalInfo.total = sections.personalInfo.required.length;
  sections.personalInfo.percentage = Math.round(
    (requiredFilled / sections.personalInfo.required.length) * 100
  );
  sections.personalInfo.bonus = optionalFilled;

  // Summary
  sections.summary.completed = resume.summary && resume.summary.trim() ? 1 : 0;
  sections.summary.percentage = sections.summary.completed * 100;

  // Experience
  sections.experience.completed = resume.experience && resume.experience.length > 0 ? 1 : 0;
  sections.experience.percentage = sections.experience.completed * 100;
  sections.experience.count = resume.experience?.length || 0;

  // Education
  sections.education.completed = resume.education && resume.education.length > 0 ? 1 : 0;
  sections.education.percentage = sections.education.completed * 100;
  sections.education.count = resume.education?.length || 0;

  // Skills
  const totalSkills = resume.skills?.reduce((sum, cat) => sum + (cat.items?.length || 0), 0) || 0;
  sections.skills.completed = totalSkills > 0 ? 1 : 0;
  sections.skills.percentage = sections.skills.completed * 100;
  sections.skills.count = totalSkills;

  // Projects
  sections.projects.completed = resume.projects && resume.projects.length > 0 ? 1 : 0;
  sections.projects.percentage = sections.projects.completed * 100;
  sections.projects.count = resume.projects?.length || 0;

  // Overall
  const totalCompleted = Object.values(sections).reduce((sum, s) => sum + s.completed, 0);
  const totalSections = Object.values(sections).reduce((sum, s) => sum + s.total, 0);
  const overallPercentage = Math.round((totalCompleted / totalSections) * 100);

  return {
    sections,
    overall: {
      completed: totalCompleted,
      total: totalSections,
      percentage: overallPercentage
    }
  };
};

/**
 * Calculate comprehensive analytics for a resume
 */
export const calculateResumeAnalytics = (resume) => {
  if (!resume) {
    return {
      wordCount: 0,
      actionVerbs: { totalBullets: 0, bulletsWithActionVerbs: 0, percentage: 0, topVerbs: [] },
      quantifiable: { totalBullets: 0, quantifiableBullets: 0, percentage: 0 },
      impactWords: { totalBullets: 0, bulletsWithImpactWords: 0, percentage: 0, topWords: [] },
      completeness: { overall: { completed: 0, total: 6, percentage: 0 }, sections: {} },
      score: 0
    };
  }

  const wordCount = calculateTotalWordCount(resume);
  const actionVerbs = calculateActionVerbUsage(resume);
  const quantifiable = calculateQuantifiableAchievements(resume);
  const impactWords = calculateImpactWordUsage(resume);
  const completeness = calculateSectionCompleteness(resume);

  // Calculate overall score (0-100)
  let score = 0;

  // Completeness: 40 points
  score += (completeness.overall.percentage * 0.4);

  // Action verbs: 20 points
  if (actionVerbs.percentage >= ANALYTICS_THRESHOLDS.ACTION_VERB_PERCENTAGE.good) {
    score += 20;
  } else if (actionVerbs.percentage >= ANALYTICS_THRESHOLDS.ACTION_VERB_PERCENTAGE.acceptable) {
    score += 15;
  } else {
    score += (actionVerbs.percentage / ANALYTICS_THRESHOLDS.ACTION_VERB_PERCENTAGE.acceptable) * 15;
  }

  // Quantifiable achievements: 20 points
  if (quantifiable.percentage >= ANALYTICS_THRESHOLDS.QUANTIFIABLE_PERCENTAGE.good) {
    score += 20;
  } else if (quantifiable.percentage >= ANALYTICS_THRESHOLDS.QUANTIFIABLE_PERCENTAGE.acceptable) {
    score += 15;
  } else {
    score += (quantifiable.percentage / ANALYTICS_THRESHOLDS.QUANTIFIABLE_PERCENTAGE.acceptable) * 15;
  }

  // Impact words: 20 points
  if (impactWords.percentage >= ANALYTICS_THRESHOLDS.IMPACT_WORD_PERCENTAGE.good) {
    score += 20;
  } else if (impactWords.percentage >= ANALYTICS_THRESHOLDS.IMPACT_WORD_PERCENTAGE.acceptable) {
    score += 15;
  } else {
    score += (impactWords.percentage / ANALYTICS_THRESHOLDS.IMPACT_WORD_PERCENTAGE.acceptable) * 15;
  }

  return {
    wordCount,
    actionVerbs,
    quantifiable,
    impactWords,
    completeness,
    score: Math.round(score)
  };
};
