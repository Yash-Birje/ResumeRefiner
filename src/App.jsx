import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ResumeProvider } from './context/ResumeContext';

// Import pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
// import ResumeBuilder from './pages/ResumeBuilder';
// import ResumePreview from './pages/ResumePreview';
// import AnalyticsPage from './pages/AnalyticsPage';

// Import components
import ProtectedRoute from './components/shared/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ResumeProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Resume Builder Routes - Will be implemented */}
            {/* <Route
              path="/resume/new"
              element={
                <ProtectedRoute>
                  <ResumeBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume/:id/edit"
              element={
                <ProtectedRoute>
                  <ResumeBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume/:id/preview"
              element={
                <ProtectedRoute>
                  <ResumePreview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics/:id"
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            /> */}

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ResumeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
