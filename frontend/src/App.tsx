import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import ModelUpload from './components/ModelUpload';
import ModelViewer from './components/ModelViewer';
import ModelZoo from './components/ModelZoo';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<ModelUpload />} />
              <Route path="/viewer" element={<ModelViewer />} />
              <Route path="/zoo" element={<ModelZoo />} />
            </Routes>
          </Layout>
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App; 