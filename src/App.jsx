import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CreateContent from './pages/modules/CreateContent';
import GeneratePosts from './pages/modules/GeneratePosts';
import BuildPitch from './pages/modules/BuildPitch';
import ManageProducts from './pages/modules/ManageProducts';
import CompetitorDashboard from './pages/modules/CompetitorDashboard';
import ScoreLeads from './pages/modules/ScoreLeads';
import PracticeSale from './pages/modules/PracticeSale';
import IntelligenceDashboard from './pages/modules/IntelligenceDashboard';
import PosterGenerator from './pages/modules/PosterGenerator';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-primary)' }}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <div style={{ width: 48, height: 48, border: '3px solid var(--color-accent)', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ font: 'var(--type-body)', color: 'rgba(255,255,255,0.6)' }}>Loading MarketMind…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Dashboard */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/create-content" element={<ProtectedRoute><CreateContent /></ProtectedRoute>} />
            <Route path="/dashboard/generate-posts" element={<ProtectedRoute><GeneratePosts /></ProtectedRoute>} />
            <Route path="/dashboard/poster-generator" element={<ProtectedRoute><PosterGenerator /></ProtectedRoute>} />
            <Route path="/dashboard/build-pitch" element={<ProtectedRoute><BuildPitch /></ProtectedRoute>} />
            <Route path="/dashboard/analyse-competitors" element={<ProtectedRoute><CompetitorDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/score-leads" element={<ProtectedRoute><ScoreLeads /></ProtectedRoute>} />
            <Route path="/dashboard/practice-sale" element={<ProtectedRoute><PracticeSale /></ProtectedRoute>} />
            <Route path="/dashboard/intelligence" element={<ProtectedRoute><IntelligenceDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/products" element={<ProtectedRoute><ManageProducts /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
