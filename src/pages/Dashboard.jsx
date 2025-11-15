import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Search, LayoutGrid, List } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortOrder, setSortOrder] = useState('newest');

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
        <div className="mb-8 relative">
          <div className="absolute -top-8 -left-8 w-56 h-56 rounded-full bg-gradient-to-br from-primary/30 to-purple-200 blur-3xl opacity-60 transform-gpu rotate-12 pointer-events-none" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your resumes and create new ones
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-2/3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resumes by title or keyword..."
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg bg-white"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>

              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-600'}`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600'}`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={handleCreateResume}
              disabled={isCreating}
              className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Resume
                </>
              )}
            </button>
          </div>
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
                {/* Top summary */}
                <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500">Total Resumes</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900">{resumes.length}</div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500">Last Updated</div>
                    <div className="mt-1 text-base text-gray-900">
                      {(() => {
                        const latest = [...resumes].sort((a, b) => {
                          const ta = new Date(a.updatedAt || a.updated_at || a.createdAt || a.created_at).getTime() || 0;
                          const tb = new Date(b.updatedAt || b.updated_at || b.createdAt || b.created_at).getTime() || 0;
                          return tb - ta;
                        })[0];

                        if (!latest) return '—';
                        const d = new Date(latest.updatedAt || latest.updated_at || latest.createdAt || latest.created_at);
                        return d.toLocaleString();
                      })()}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm hidden sm:block">
                    <div className="text-sm text-gray-500">Quick Actions</div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => { setSearchQuery(''); setSortOrder('newest'); setViewMode('grid'); }}
                        className="px-3 py-1 bg-gray-100 rounded-md text-sm"
                      >
                        Reset View
                      </button>
                    </div>
                  </div>
                </div>

                {/* Resumes list */}
                <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}`}>
                  {(() => {
                    // filter
                    const q = searchQuery.trim().toLowerCase();
                    let list = resumes.filter(r => {
                      if (!q) return true;
                      const title = (r.title || r.name || '').toString().toLowerCase();
                      const summary = (r.summary || r.description || '').toString().toLowerCase();
                      return title.includes(q) || summary.includes(q);
                    });

                    // sort
                    list = list.sort((a, b) => {
                      const ta = new Date(a.updatedAt || a.updated_at || a.createdAt || a.created_at).getTime() || 0;
                      const tb = new Date(b.updatedAt || b.updated_at || b.createdAt || b.created_at).getTime() || 0;
                      return sortOrder === 'newest' ? tb - ta : ta - tb;
                    });

                    return list.map(resume => (
                      <div key={resume.id} className="hover:shadow-lg transition-shadow rounded-lg">
                        <ResumeCard
                          resume={resume}
                          onDelete={handleDeleteResume}
                          onDuplicate={handleDuplicateResume}
                        />
                      </div>
                    ));
                  })()}
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
