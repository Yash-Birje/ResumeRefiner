import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import {
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
  ArrowLeft,
  Download,
  Target,
  Award
} from 'lucide-react';
import Navbar from '../components/shared/Navbar';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { getResumeAnalytics, getAnalyticsSuggestions, getScoreRating, exportAnalyticsData } from '../api/analyticsService';

const AnalyticsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadAnalytics();
    }
  }, [id]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError('');

    const result = await getResumeAnalytics(id);
    // console.log('Analytics fetch result:', Promise.resolve(result));
    if (result.success) {
      setAnalyticsData(result);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleDownloadReport = () => {
    const dataStr = exportAnalyticsData(analyticsData);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume-analytics-${id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingSpinner size="lg" center />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-red-900">Error Loading Analytics</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-3 text-sm text-red-700 underline hover:text-red-900"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { analytics, resumeTitle, targetRole } = analyticsData;
  const suggestions = getAnalyticsSuggestions(analytics);
  const scoreRating = getScoreRating(analytics.score);

  // Prepare chart data
  const metricsData = [
    { name: 'Action Verbs', value: analytics.actionVerbs.percentage, fullMark: 100 },
    { name: 'Quantifiable', value: analytics.quantifiable.percentage, fullMark: 100 },
    { name: 'Impact Words', value: analytics.impactWords.percentage, fullMark: 100 },
    { name: 'Completeness', value: analytics.completeness.overall.percentage, fullMark: 100 }
  ];

  const sectionCompletionData = Object.entries(analytics.completeness.sections).map(([key, section]) => ({
    name: section.name,
    percentage: section.percentage
  }));

  const topVerbsData = analytics.actionVerbs.topVerbs.slice(0, 8);
  const topImpactWordsData = analytics.impactWords.topWords.slice(0, 8);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  const getScoreColor = (score) => {
    if (score >= 90) return '#10B981';
    if (score >= 75) return '#3B82F6';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#F97316';
    return '#EF4444';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/resume/${id}/edit`)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Resume</span>
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{resumeTitle || 'Untitled Resume'}</h1>
              {targetRole && (
                <p className="text-gray-600 mt-1 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Target Role: {targetRole}
                </p>
              )}
            </div>

            <button
              onClick={handleDownloadReport}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </button>
          </div>
        </div>

        {/* Overall Score */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Overall Resume Score
              </h2>
              <p className="text-gray-600 text-sm">{scoreRating.message}</p>
            </div>

            <div className="text-center">
              <div
                className="text-6xl font-bold mb-2"
                style={{ color: getScoreColor(analytics.score) }}
              >
                {analytics.score}
              </div>
              <div className="text-lg font-semibold" style={{ color: getScoreColor(analytics.score) }}>
                {scoreRating.rating}
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Word Count"
            value={analytics.wordCount}
            icon={<TrendingUp className="w-5 h-5" />}
            color="blue"
          />
          <MetricCard
            title="Action Verbs"
            value={`${analytics.actionVerbs.percentage}%`}
            subtitle={`${analytics.actionVerbs.bulletsWithActionVerbs}/${analytics.actionVerbs.totalBullets} bullets`}
            icon={<CheckCircle className="w-5 h-5" />}
            color={analytics.actionVerbs.percentage >= 70 ? 'green' : 'yellow'}
          />
          <MetricCard
            title="Quantifiable"
            value={`${analytics.quantifiable.percentage}%`}
            subtitle={`${analytics.quantifiable.quantifiableBullets}/${analytics.quantifiable.totalBullets} with metrics`}
            icon={<TrendingUp className="w-5 h-5" />}
            color={analytics.quantifiable.percentage >= 40 ? 'green' : 'yellow'}
          />
          <MetricCard
            title="Impact Words"
            value={`${analytics.impactWords.percentage}%`}
            subtitle={`${analytics.impactWords.bulletsWithImpactWords}/${analytics.impactWords.totalBullets} bullets`}
            icon={<CheckCircle className="w-5 h-5" />}
            color={analytics.impactWords.percentage >= 50 ? 'green' : 'yellow'}
          />
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Suggestions for Improvement</h2>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <SuggestionItem key={index} suggestion={suggestion} />
              ))}
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Radar Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={metricsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Section Completion */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Completion</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectionCompletionData}>
                <Tooltip />
                <Bar dataKey="percentage" fill="#3B82F6" radius={[8, 8, 0, 0]}>
                  {sectionCompletionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.percentage === 100 ? '#10B981' : '#3B82F6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {sectionCompletionData.map((section, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{section.name}</span>
                  <span className={`font-semibold ${section.percentage === 100 ? 'text-green-600' : 'text-blue-600'}`}>
                    {section.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Action Verbs */}
          {topVerbsData.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Used Action Verbs</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topVerbsData} layout="vertical">
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" radius={[0, 8, 8, 0]}>
                    {topVerbsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {topVerbsData.map((verb, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{verb.verb}</span>
                    <span className="font-semibold text-gray-900">{verb.count}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Impact Words */}
          {topImpactWordsData.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Used Impact Words</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topImpactWordsData} layout="vertical">
                  <Tooltip />
                  <Bar dataKey="count" fill="#10B981" radius={[0, 8, 8, 0]}>
                    {topImpactWordsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {topImpactWordsData.map((word, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{word.word}</span>
                    <span className="font-semibold text-gray-900">{word.count}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, subtitle, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
};

// Suggestion Item Component
const SuggestionItem = ({ suggestion }) => {
  const typeIcons = {
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />
  };

  const typeColors = {
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div className={`flex items-start space-x-3 p-4 rounded-lg border ${typeColors[suggestion.type]}`}>
      <div className="flex-shrink-0 mt-0.5">
        {typeIcons[suggestion.type]}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-900">{suggestion.category}</h4>
        <p className="text-sm text-gray-700 mt-1">{suggestion.message}</p>
        <p className="text-sm text-gray-600 mt-1 italic">{suggestion.suggestion}</p>
      </div>
    </div>
  );
};

export default AnalyticsPage;
