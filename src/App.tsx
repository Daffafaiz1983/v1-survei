import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/AuthForm';
import { SurveyForm } from './components/SurveyForm';
import { AdminDashboard } from './components/AdminDashboard';
import { Header } from './components/Header';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'survey' | 'dashboard'>('survey');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="text-gray-600 text-lg">Memuat aplikasi...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onNavigate={setCurrentView}
        currentView={currentView}
      />
      {profile.role === 'admin' && currentView === 'dashboard' ? (
        <AdminDashboard />
      ) : (
        <SurveyForm />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
