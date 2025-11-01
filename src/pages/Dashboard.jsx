import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useResume } from '../hooks/useResume';
import Navbar from '../components/shared/Navbar';
import ResumeCard from '../components/dashboard/ResumeCard';
import EmptyState from '../components/shared/EmptyState';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { resumes, loading, loadResumes, createResume, deleteResume, duplicateResume } = useResume();
  const [isCreating, setIsCreating] = useState(false);

  // Load resumes on mount
  useEffect(() => {
    if (currentUser) {
      loadResumes();
    }
  }, [currentUser, loadResumes]);

  // Handle create new resume
  const handleCreateResume = async () => {
    setIsCreating(true);

    try {
      const result = await createResume();

      if (result.success && result.resume) {
        // Navigate to resume builder
        navigate(`/resume/${result.resume.id}/edit`);
      }
    } catch (error) {
      console.error('Error creating resume:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Handle delete resume
  const handleDeleteResume = async (resumeId) => {
    await deleteResume(resumeId);
  };

  // Handle duplicate resume
  const handleDuplicateResume = async (resumeId) => {
    const result = await duplicateResume(resumeId);
    if (result.success && result.resume) {
      navigate(`/resume/${result.resume.id}/edit`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your resumes and create new ones
          </p>
        </div>

        {/* Create New Resume Button */}
        <div className="mb-8">
          <button
            onClick={handleCreateResume}
            disabled={isCreating}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                <span className="ml-2">Creating...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Create New Resume
              </>
            )}
          </button>
        </div>

        {/* Loading State */}
        {loading && !isCreating && (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Resumes Section */}
        {!loading && (
          <>
            {resumes.length === 0 ? (
              // Empty State
              <EmptyState
                icon={<FileText className="w-16 h-16" />}
                title="No resumes yet"
                description="Create your first professional resume to get started"
                actionButton={{
                  text: 'Create Your First Resume',
                  onClick: handleCreateResume
                }}
              />
            ) : (
              // Resume Grid
              <>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    My Resumes ({resumes.length})
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resumes.map(resume => (
                    <ResumeCard
                      key={resume.id}
                      resume={resume}
                      onDelete={handleDeleteResume}
                      onDuplicate={handleDuplicateResume}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
