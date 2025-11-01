import { GoogleGenerativeAI } from '@google/generative-ai';
import { ERROR_MESSAGES } from '../utils/constants';

// Initialize Gemini AI
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI = null;
let model = null;

// Initialize only if API key is available
if (apiKey && apiKey !== 'your_api_key_here') {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  } catch (error) {
    console.error('Failed to initialize Gemini AI:', error);
  }
}

// Rate limiting
let lastCallTime = 0;
const RATE_LIMIT_MS = 2000; // 2 seconds between calls

const checkRateLimit = () => {
  const now = Date.now();
  if (now - lastCallTime < RATE_LIMIT_MS) {
    return false;
  }
  lastCallTime = now;
  return true;
};

/**
 * Suggest skills based on target role
 * @param {string} targetRole - Job title/role
 * @param {array} existingSkills - Skills already in resume
 * @returns {Promise<{success: boolean, skills?: array, error?: string}>}
 */
export const suggestSkills = async (targetRole, existingSkills = []) => {
  if (!model) {
    return {
      success: false,
      error: 'AI service not configured. Please add your Gemini API key to the .env file.'
    };
  }

  if (!targetRole || !targetRole.trim()) {
    return {
      success: false,
      error: ERROR_MESSAGES.AI.NO_TARGET_ROLE
    };
  }

  if (!checkRateLimit()) {
    return {
      success: false,
      error: ERROR_MESSAGES.AI.RATE_LIMIT
    };
  }

  try {
    const existingSkillsList = existingSkills
      .flatMap(cat => cat.items || [])
      .join(', ');

    const prompt = `Generate a list of 10-15 relevant technical and professional skills for a ${targetRole} position.
Focus on current industry-standard skills, tools, and technologies.
${existingSkillsList ? `Exclude these skills already present: ${existingSkillsList}` : ''}
Return ONLY a valid JSON array of skill names, no explanation or additional text.
Format: ["skill1", "skill2", "skill3"]
Example: ["React", "JavaScript", "Node.js", "Git", "Agile Methodologies"]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return {
        success: false,
        error: ERROR_MESSAGES.AI.INVALID_RESPONSE
      };
    }

    const skills = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(skills) || skills.length === 0) {
      return {
        success: false,
        error: ERROR_MESSAGES.AI.INVALID_RESPONSE
      };
    }

    return {
      success: true,
      skills: skills.map(s => s.trim()).filter(s => s.length > 0)
    };
  } catch (error) {
    console.error('Error generating skill suggestions:', error);
    return {
      success: false,
      error: ERROR_MESSAGES.AI.FAILED
    };
  }
};

/**
 * Generate professional summary
 * @param {object} personalInfo - Personal information
 * @param {array} experience - Work experience
 * @param {array} education - Education
 * @param {string} targetRole - Target job role
 * @returns {Promise<{success: boolean, summary?: string, error?: string}>}
 */
export const generateSummary = async (personalInfo, experience, education, targetRole) => {
  if (!model) {
    return {
      success: false,
      error: 'AI service not configured. Please add your Gemini API key to the .env file.'
    };
  }

  if (!targetRole || !targetRole.trim()) {
    return {
      success: false,
      error: ERROR_MESSAGES.AI.NO_TARGET_ROLE
    };
  }

  if ((!experience || experience.length === 0) && (!education || education.length === 0)) {
    return {
      success: false,
      error: 'Please add at least one experience or education entry first'
    };
  }

  if (!checkRateLimit()) {
    return {
      success: false,
      error: ERROR_MESSAGES.AI.RATE_LIMIT
    };
  }

  try {
    // Build context from experience
    let experienceContext = '';
    if (experience && experience.length > 0) {
      experienceContext = experience
        .map(exp => `- ${exp.position} at ${exp.company} (${exp.startDate} to ${exp.endDate || 'present'})`)
        .join('\n');
    }

    // Build context from education
    let educationContext = '';
    if (education && education.length > 0) {
      educationContext = education
        .map(edu => `- ${edu.degree} in ${edu.field} from ${edu.institution}`)
        .join('\n');
    }

    const prompt = `Write a professional resume summary (3-4 sentences) for a ${targetRole} with the following background:

${experienceContext ? `Experience:\n${experienceContext}\n` : ''}
${educationContext ? `Education:\n${educationContext}\n` : ''}

The summary should:
- Highlight years of experience and key expertise
- Emphasize relevant achievements and strengths
- Target the ${targetRole} position
- Be concise and impactful (max 100 words)
- Use strong action verbs
- Sound professional and confident

Return ONLY the summary text, no additional formatting, quotes, or explanations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text().trim();

    // Clean up any extra quotes or formatting
    const cleanSummary = summary.replace(/^["']|["']$/g, '').trim();

    if (!cleanSummary || cleanSummary.length < 50) {
      return {
        success: false,
        error: ERROR_MESSAGES.AI.INVALID_RESPONSE
      };
    }

    return {
      success: true,
      summary: cleanSummary
    };
  } catch (error) {
    console.error('Error generating summary:', error);
    return {
      success: false,
      error: ERROR_MESSAGES.AI.FAILED
    };
  }
};

/**
 * Improve a resume bullet point
 * @param {string} bulletText - Original bullet point text
 * @param {string} position - Job position (for context)
 * @param {string} targetRole - Target role (for relevance)
 * @returns {Promise<{success: boolean, improvedText?: string, error?: string}>}
 */
export const improveBullet = async (bulletText, position, targetRole) => {
  if (!model) {
    return {
      success: false,
      error: 'AI service not configured. Please add your Gemini API key to the .env file.'
    };
  }

  if (!bulletText || !bulletText.trim()) {
    return {
      success: false,
      error: 'Bullet point text is required'
    };
  }

  if (!checkRateLimit()) {
    return {
      success: false,
      error: ERROR_MESSAGES.AI.RATE_LIMIT
    };
  }

  try {
    const prompt = `Improve this resume bullet point for a ${position || 'professional'} targeting a ${targetRole || 'similar'} role:

Original: "${bulletText}"

Make it more impactful by:
- Starting with a strong action verb
- Adding quantifiable metrics if implied (use realistic estimates like percentages, numbers, timeframes)
- Highlighting the impact/result
- Keeping it concise (max 150 characters)
- Making it ATS-friendly with relevant keywords
- Using professional language

Return ONLY the improved bullet point, no explanation, quotation marks, or additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const improvedText = response.text().trim();

    // Clean up any extra quotes or formatting
    const cleanText = improvedText.replace(/^["']|["']$/g, '').trim();

    if (!cleanText || cleanText.length < 10) {
      return {
        success: false,
        error: ERROR_MESSAGES.AI.INVALID_RESPONSE
      };
    }

    return {
      success: true,
      improvedText: cleanText
    };
  } catch (error) {
    console.error('Error improving bullet point:', error);
    return {
      success: false,
      error: ERROR_MESSAGES.AI.FAILED
    };
  }
};

/**
 * Check if AI service is configured
 * @returns {boolean}
 */
export const isAIConfigured = () => {
  return model !== null;
};
