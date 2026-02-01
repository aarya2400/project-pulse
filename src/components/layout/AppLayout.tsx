import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from './AppSidebar';
import { AppNavbar } from './AppNavbar';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
  '/timeline': 'Timeline',
  '/team': 'Team',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

export function AppLayout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const pageTitle = pageTitles[location.pathname] || 'Project Health';
  const showProjectSelector = ['/dashboard', '/tasks', '/timeline'].includes(
    location.pathname
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <AppNavbar
          pageTitle={pageTitle}
          selectedProjectId={showProjectSelector ? selectedProjectId : undefined}
          onProjectChange={showProjectSelector ? setSelectedProjectId : undefined}
        />
        
        <main className="page-content">
          <Outlet context={{ selectedProjectId, setSelectedProjectId }} />
        </main>
      </div>
    </div>
  );
}
