import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Download, Eye, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useResume } from '../hooks/useResume';
import { useAutoSave } from '../hooks/useAutoSave';
import Navbar from '../components/shared/Navbar';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ResumeForm from '../components/resume/ResumeForm';
import ResumePreview from '../components/resume/ResumePreview';
import { exportToPDF, generatePDFFilename } from '../utils/pdfExporter';

// Template imports
const templateOptions = [
  { value: 'modern', label: 'Modern' },
  // { value: 'classic', label: 'Classic' },
  // { value: 'minimalist', label: 'Minimalist' },
  { value: 'creative', label: 'Creative' },
  { value: 'executive', label: 'Executive' },
  { value: 'ats', label: 'ATS Optimized' },
  { value: 'infographic', label: 'Infographic' },
  { value: 'startup', label: 'Startup' }
];

const ResumeBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { currentResume, loadResume, updateCurrentResume, autoSave, loading } = useResume();
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview' for mobile
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const previewRef = useRef(null);

  // Load resume on mount
  useEffect(() => {
    if (id && id !== 'new') {
      loadResume(id);
    }
  }, [id, loadResume]);

  // Auto-save current resume
  const { isSaving, lastSaved } = useAutoSave(
    currentResume,
    (data) => autoSave(data),
    3000
  );

  // Handle field updates
  const handleUpdateResume = (updates) => {
    updateCurrentResume(updates);
  };

  // Navigate to preview page
  const handleFullPreview = () => {
    if (currentResume) {
      navigate(`/resume/${currentResume.id}/preview`);
    }
  };

  // Handle PDF export
  const handleExportPDF = async () => {
    if (!previewRef.current) {
      setExportError('Preview not ready for export');
      return;
    }

    setIsExporting(true);
    setExportError('');

    try {
      // Get the actual resume element from the preview
      const resumeElement = previewRef.current.querySelector('[data-resume-content]');

      if (!resumeElement) {
        setExportError('Resume content not found');
        setIsExporting(false);
        return;
      }

      const filename = generatePDFFilename(currentResume);
      const result = await exportToPDF(resumeElement, filename);

      if (!result.success) {
        setExportError(result.error);
      }
    } catch (error) {
      console.error('Export error:', error);
      setExportError('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentResume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Resume not found</p>
          <Link to="/dashboard" className="text-primary hover:text-primary-dark">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back button and title */}
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>

              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={currentResume.title}
                  onChange={(e) => handleUpdateResume({ title: e.target.value })}
                  className="text-xl font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 w-full"
                  placeholder="Untitled Resume"
                />
                <input
                  type="text"
                  value={currentResume.targetRole}
                  onChange={(e) => handleUpdateResume({ targetRole: e.target.value })}
                  className="text-sm text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 w-full"
                  placeholder="e.g., Frontend Developer"
                />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-4">
              {/* Auto-save indicator */}
              <div className="text-sm text-gray-600">
                {isSaving ? (
                  <span className="flex items-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Saving...</span>
                  </span>
                ) : lastSaved ? (
                  <span className="text-green-600">✓ All changes saved</span>
                ) : null}
              </div>

              {/* Template selector */}
              <select
                value={currentResume.template}
                onChange={(e) => handleUpdateResume({ template: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {templateOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Preview button (desktop) */}
              <button
                onClick={handleFullPreview}
                className="hidden md:flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>

              {/* Export PDF button */}
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Export PDF"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'edit'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'preview'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Split View Container */}
      <div className="flex-1">
        {/* Desktop: Split View */}
        <div className="hidden md:flex h-[calc(100vh-180px)]">
          {/* Left: Form */}
          <div className="w-1/2 overflow-y-auto border-r border-gray-200 bg-white">
            <ResumeForm
              resume={currentResume}
              onUpdate={handleUpdateResume}
            />
          </div>

          {/* Right: Preview */}
          <div className="w-1/2 overflow-y-auto bg-gray-100" ref={previewRef}>
            <ResumePreview resume={currentResume} />
          </div>
        </div>

        {/* Mobile: Tabbed View */}
        <div className="md:hidden">
          {activeTab === 'edit' ? (
            <div className="bg-white">
              <ResumeForm
                resume={currentResume}
                onUpdate={handleUpdateResume}
              />
            </div>
          ) : (
            <div className="bg-gray-100 min-h-screen">
              <ResumePreview resume={currentResume} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
