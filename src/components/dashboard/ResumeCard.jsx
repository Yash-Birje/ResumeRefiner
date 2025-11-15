import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, BarChart3, Eye, MoreVertical, Copy, Trash2, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Modal from '../shared/Modal';

const ResumeCard = ({ resume, onDelete, onDuplicate }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tiltTransform, setTiltTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');

  // Tilt handlers for 3D effect
  const handleMouseMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const maxDeg = 8;
    const rotateY = ((x - cx) / cx) * maxDeg;
    const rotateX = -((y - cy) / cy) * maxDeg;
    setTiltTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`);
  };

  const handleMouseLeave = () => {
    setTiltTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
  };

  // Calculate completion percentage (simple calculation)
  const calculateCompletion = () => {
    let completed = 0;
    const total = 6;

    if (resume.personalInfo?.fullName && resume.personalInfo?.email) completed++;
    if (resume.summary) completed++;
    if (resume.experience?.length > 0) completed++;
    if (resume.education?.length > 0) completed++;
    if (resume.skills?.length > 0) completed++;
    if (resume.projects?.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  // Calculate word count (simple)
  const calculateWordCount = () => {
    let count = 0;

    if (resume.summary) {
      count += resume.summary.split(/\s+/).length;
    }

    resume.experience?.forEach(exp => {
      exp.description?.forEach(bullet => {
        count += bullet.split(/\s+/).length;
      });
    });

    resume.projects?.forEach(proj => {
      if (proj.description) count += proj.description.split(/\s+/).length;
      proj.highlights?.forEach(highlight => {
        count += highlight.split(/\s+/).length;
      });
    });

    return count;
  };

  // Format date
  const getLastUpdated = () => {
    try {
      return formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  // Template badge color
  const getTemplateBadgeColor = () => {
    const colors = {
      modern: 'bg-blue-100 text-blue-800',
      classic: 'bg-purple-100 text-purple-800',
      minimalist: 'bg-gray-100 text-gray-800',
      creative: 'bg-pink-100 text-pink-800',
      executive: 'bg-slate-100 text-slate-800',
      ats: 'bg-green-100 text-green-800',
      infographic: 'bg-indigo-100 text-indigo-800',
      startup: 'bg-teal-100 text-teal-800'
    };
    return colors[resume.template] || colors.modern;
  };

  const getTemplateDisplayName = () => {
    const names = {
      modern: 'Modern',
      classic: 'Classic',
      minimalist: 'Minimalist',
      creative: 'Creative',
      executive: 'Executive',
      ats: 'ATS Optimized',
      infographic: 'Infographic',
      startup: 'Startup'
    };
    return names[resume.template] || 'Modern';
  };

  // Handle actions
  const handleEdit = () => {
    navigate(`/resume/${resume.id}/edit`);
  };

  const handleAnalytics = () => {
    navigate(`/resume/${resume.id}/analytics`);
  };

  const handlePreview = () => {
    navigate(`/resume/${resume.id}/preview`);
  };

  const handleDuplicate = () => {
    setShowMenu(false);
    onDuplicate(resume.id);
  };

  const handleDelete = () => {
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    onDelete(resume.id);
    setShowDeleteModal(false);
  };

  const completion = calculateCompletion();
  const wordCount = calculateWordCount();

  return (
    <>
      <div className="relative" style={{ perspective: '1000px' }}>
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transform: tiltTransform, transition: 'transform 200ms ease', willChange: 'transform' }}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden transform-gpu"
        >
        {/* Card Header */}
        <div className="p-6">
          {/* Title and Menu */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                {resume.title || 'Untitled Resume'}
              </h3>
              {resume.targetRole && (
                <p className="text-sm text-gray-600 truncate">{resume.targetRole}</p>
              )}
            </div>

            {/* More Menu */}
            <div className="relative ml-2">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {showMenu && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />

                  {/* Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20 border border-gray-200">
                    <button
                      onClick={handleDuplicate}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Duplicate</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Template Badge */}
          <div className="mb-4">
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getTemplateBadgeColor()}`}>
              {getTemplateDisplayName()}
            </span>
          </div>

          {/* Last Updated */}
          <p className="text-xs text-gray-500 mb-4">{getLastUpdated()}</p>

          {/* Metrics */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{wordCount} words</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-xs text-green-600 font-medium">{completion}%</span>
              </div>
              <span className="text-sm text-gray-600">Complete</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <button
            onClick={handleEdit}
            className="flex items-center space-x-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>

          <button
            onClick={handleAnalytics}
            className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          <button
            onClick={handlePreview}
            className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
        </div>
      </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Resume?"
        size="sm"
      >
        <div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{resume.title || 'Untitled Resume'}"? This action cannot be undone.
          </p>

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ResumeCard;
