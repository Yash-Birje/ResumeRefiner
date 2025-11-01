// Resume service for managing resumes in localStorage

import { DEFAULT_RESUME, STORAGE_KEYS } from '../utils/constants';

// Helper to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all resumes from localStorage
const getResumes = () => {
  const resumes = localStorage.getItem(STORAGE_KEYS.RESUMES);
  return resumes ? JSON.parse(resumes) : [];
};

// Save resumes to localStorage
const saveResumes = (resumes) => {
  localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(resumes));
};

/**
 * Get all resumes for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean, resumes?: array, error?: string}>}
 */
export const getUserResumes = async (userId) => {
  await delay(300);

  try {
    const allResumes = getResumes();
    const userResumes = allResumes.filter(r => r.userId === userId);

    // Sort by updatedAt (most recent first)
    userResumes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return {
      success: true,
      resumes: userResumes
    };
  } catch (error) {
    console.error('Error loading resumes:', error);
    return {
      success: false,
      error: 'Failed to load resumes'
    };
  }
};

/**
 * Get a single resume by ID
 * @param {string} resumeId - Resume ID
 * @returns {Promise<{success: boolean, resume?: object, error?: string}>}
 */
export const getResumeById = async (resumeId) => {
  await delay(200);

  try {
    const allResumes = getResumes();
    const resume = allResumes.find(r => r.id === resumeId);

    if (!resume) {
      return {
        success: false,
        error: 'Resume not found'
      };
    }

    return {
      success: true,
      resume
    };
  } catch (error) {
    console.error('Error loading resume:', error);
    return {
      success: false,
      error: 'Failed to load resume'
    };
  }
};

/**
 * Create a new resume
 * @param {string} userId - User ID
 * @param {object} userData - User data (name, email) for pre-filling
 * @returns {Promise<{success: boolean, resume?: object, error?: string}>}
 */
export const createResume = async (userId, userData = {}) => {
  await delay(300);

  try {
    const newResume = {
      ...DEFAULT_RESUME,
      id: crypto.randomUUID ? crypto.randomUUID() : `resume-${Date.now()}`,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      personalInfo: {
        ...DEFAULT_RESUME.personalInfo,
        fullName: userData.name || '',
        email: userData.email || ''
      }
    };

    const allResumes = getResumes();
    allResumes.push(newResume);
    saveResumes(allResumes);

    return {
      success: true,
      resume: newResume
    };
  } catch (error) {
    console.error('Error creating resume:', error);
    return {
      success: false,
      error: 'Failed to create resume'
    };
  }
};

/**
 * Update an existing resume
 * @param {string} resumeId - Resume ID
 * @param {object} updates - Updated resume data
 * @returns {Promise<{success: boolean, resume?: object, error?: string}>}
 */
export const updateResume = async (resumeId, updates) => {
  await delay(200);

  try {
    const allResumes = getResumes();
    const resumeIndex = allResumes.findIndex(r => r.id === resumeId);

    if (resumeIndex === -1) {
      return {
        success: false,
        error: 'Resume not found'
      };
    }

    // Merge updates with existing resume
    const updatedResume = {
      ...allResumes[resumeIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    allResumes[resumeIndex] = updatedResume;
    saveResumes(allResumes);

    return {
      success: true,
      resume: updatedResume
    };
  } catch (error) {
    console.error('Error updating resume:', error);
    return {
      success: false,
      error: 'Failed to update resume'
    };
  }
};

/**
 * Delete a resume
 * @param {string} resumeId - Resume ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteResume = async (resumeId) => {
  await delay(200);

  try {
    const allResumes = getResumes();
    const filteredResumes = allResumes.filter(r => r.id !== resumeId);

    if (filteredResumes.length === allResumes.length) {
      return {
        success: false,
        error: 'Resume not found'
      };
    }

    saveResumes(filteredResumes);

    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting resume:', error);
    return {
      success: false,
      error: 'Failed to delete resume'
    };
  }
};

/**
 * Duplicate a resume
 * @param {string} resumeId - Resume ID to duplicate
 * @returns {Promise<{success: boolean, resume?: object, error?: string}>}
 */
export const duplicateResume = async (resumeId) => {
  await delay(300);

  try {
    const allResumes = getResumes();
    const originalResume = allResumes.find(r => r.id === resumeId);

    if (!originalResume) {
      return {
        success: false,
        error: 'Resume not found'
      };
    }

    // Create duplicate with new ID and updated title
    const duplicatedResume = {
      ...originalResume,
      id: crypto.randomUUID ? crypto.randomUUID() : `resume-${Date.now()}`,
      title: `Copy of ${originalResume.title}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    allResumes.push(duplicatedResume);
    saveResumes(allResumes);

    return {
      success: true,
      resume: duplicatedResume
    };
  } catch (error) {
    console.error('Error duplicating resume:', error);
    return {
      success: false,
      error: 'Failed to duplicate resume'
    };
  }
};

/**
 * Auto-save resume (no delay for immediate save)
 * @param {string} resumeId - Resume ID
 * @param {object} updates - Updated resume data
 * @returns {Promise<{success: boolean, resume?: object, error?: string}>}
 */
export const autoSaveResume = async (resumeId, updates) => {
  // No artificial delay for auto-save
  try {
    const allResumes = getResumes();
    const resumeIndex = allResumes.findIndex(r => r.id === resumeId);

    if (resumeIndex === -1) {
      return {
        success: false,
        error: 'Resume not found'
      };
    }

    const updatedResume = {
      ...allResumes[resumeIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    allResumes[resumeIndex] = updatedResume;
    saveResumes(allResumes);

    return {
      success: true,
      resume: updatedResume
    };
  } catch (error) {
    console.error('Error auto-saving resume:', error);
    return {
      success: false,
      error: 'Auto-save failed'
    };
  }
};
