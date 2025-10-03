import { useAuth } from '../contexts/AuthContext';
import { LogOut, BarChart3 } from 'lucide-react';

interface HeaderProps {
  onNavigate?: (view: 'survey' | 'dashboard') => void;
  currentView?: 'survey' | 'dashboard';
}

export function Header({ onNavigate, currentView }: HeaderProps) {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Survei FISIP UI
            </h1>
            <p className="text-sm text-gray-600">
              {profile?.full_name} ({profile?.role})
            </p>
          </div>

          <div className="flex items-center gap-3">
            {profile?.role === 'admin' && onNavigate && (
              <button
                onClick={() => onNavigate(currentView === 'survey' ? 'dashboard' : 'survey')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                {currentView === 'survey' ? 'Dashboard' : 'Survei'}
              </button>
            )}

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
