import React from 'react';
import Navigation from './Navigation';
import { CommandPalette } from './CommandPalette';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
      <CommandPalette />
    </div>
  );
};

export default Layout; 