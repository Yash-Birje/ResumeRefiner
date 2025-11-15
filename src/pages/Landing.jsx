import { Link } from 'react-router-dom';
import { FileText, Sparkles, BarChart3, Download, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import Resume3D from '../components/shared/Resume3D';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ResumeRefine</span>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-white/80 hover:text-white font-medium transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 border border-cyan-400/50 rounded-full">
            <span className="text-cyan-300 text-sm font-semibold">✨ AI-Powered Resume Building</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 mb-6">
            Build Professional Resumes
            <br />
            Powered by AI
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Create ATS-optimized resumes in minutes with intelligent skill suggestions,
            real-time analytics, and professional templates
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-white rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all font-bold text-lg flex items-center hover:scale-105 transform"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 border-2 border-cyan-400 text-cyan-300 rounded-xl hover:bg-cyan-400 hover:text-slate-900 transition-all font-bold text-lg hover:shadow-lg hover:shadow-cyan-400/50"
            >
              See Features
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 mb-6">
            Everything You Need to Succeed
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Powerful features to help you create resumes that get noticed
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="group relative bg-white/5 backdrop-blur border border-white/10 p-8 rounded-2xl hover:border-cyan-400/50 transition-all hover:shadow-2xl hover:shadow-cyan-400/20 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                AI-Powered Suggestions
              </h3>
              <p className="text-gray-400">
                Get intelligent skill recommendations and professional summary generation powered by AI
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative bg-white/5 backdrop-blur border border-white/10 p-8 rounded-2xl hover:border-purple-400/50 transition-all hover:shadow-2xl hover:shadow-purple-400/20 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Multiple Templates
              </h3>
              <p className="text-gray-400">
                Choose from modern, classic, and minimalist templates with live preview
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative bg-white/5 backdrop-blur border border-white/10 p-8 rounded-2xl hover:border-cyan-400/50 transition-all hover:shadow-2xl hover:shadow-cyan-400/20 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Real-Time Analytics
              </h3>
              <p className="text-gray-400">
                Track your resume quality with actionable metrics and ATS compatibility insights
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group relative bg-white/5 backdrop-blur border border-white/10 p-8 rounded-2xl hover:border-purple-400/50 transition-all hover:shadow-2xl hover:shadow-purple-400/20 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Download className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Export to PDF
              </h3>
              <p className="text-gray-400">
                Download your professionally formatted resume as a PDF with one click
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 mb-8">
              Why Choose ResumeRefine?
            </h2>
            <div className="space-y-6">
              <div className="flex items-start group">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2 text-lg">ATS-Optimized</h3>
                  <p className="text-gray-400">
                    Ensure your resume passes Applicant Tracking Systems
                  </p>
                </div>
              </div>
              <div className="flex items-start group">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2 text-lg">Save Time</h3>
                  <p className="text-gray-400">
                    Build professional resumes in minutes, not hours
                  </p>
                </div>
              </div>
              <div className="flex items-start group">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2 text-lg">Data-Driven</h3>
                  <p className="text-gray-400">
                    Make improvements based on real metrics and analytics
                  </p>
                </div>
              </div>
              <div className="flex items-start group">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2 text-lg">Easy to Use</h3>
                  <p className="text-gray-400">
                    Intuitive interface with live preview and auto-save
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Screenshot with 3D effect */}
          <div className="relative group">
            <Resume3D />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div className="relative bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl p-12 md:p-16 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Build Your Perfect Resume?
            </h2>
            <p className="text-blue-50 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of job seekers creating professional resumes with ResumeRefine
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-xl hover:bg-gray-100 transition-all font-bold text-lg hover:shadow-xl hover:shadow-white/50 hover:scale-105 transform"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">ResumeRefine</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 ResumeRefine. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
