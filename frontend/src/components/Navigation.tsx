import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { useTheme } from './theme-provider';
import { Moon, Sun, Upload, Home, Box } from 'lucide-react';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const routes = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/viewer', label: 'Viewer', icon: Box },
    { path: '/zoo', label: 'Model Zoo', icon: Upload },
  ];

  return (
    <nav className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center space-x-4">
        {routes.map((route) => {
          const Icon = route.icon;
          return (
            <Button
              key={route.path}
              variant={location.pathname === route.path ? 'default' : 'ghost'}
              onClick={() => navigate(route.path)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {route.label}
            </Button>
          );
        })}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Button>
    </nav>
  );
};

export default Navigation; 