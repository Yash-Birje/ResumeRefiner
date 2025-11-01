import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, BarChart3, Loader2 } from 'lucide-react';
import Navbar from '../components/shared/Navbar';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ResumePreview from '../components/resume/ResumePreview';
import { useResume } from '../hooks/useResume';
import { exportToPDF, generatePDFFilename } from '../utils/pdfExporter';

const ResumePreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentResume, loadResume, loading } = useResume();
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const previewRef = useRef(null);

  useEffect(() => {
    if (id) {
      loadResume(id);
    }
  }, [id, loadResume]);

  const handleExportPDF = async () => {
    if (!previewRef.current) {
      setExportError('Preview not ready for export');
      return;
    }

    setIsExporting(true);
    setExportError('');

    try {
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingSpinner size="lg" center />
      </div>
    );
  }

  if (!currentResume) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Resume not found</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-primary hover:text-primary-dark"
            >
              Back to Dashboard
            </button>
          </div>
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
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/resume/${id}/edit`)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentResume.title || 'Untitled Resume'}
                </h1>
                {currentResume.targetRole && (
                  <p className="text-sm text-gray-600">{currentResume.targetRole}</p>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(`/resume/${id}/analytics`)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </button>

              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Export PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {exportError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{exportError}</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div ref={previewRef}>
          <ResumePreview resume={currentResume} />
        </div>
      </div>
    </div>
  );
};

export default ResumePreviewPage;
