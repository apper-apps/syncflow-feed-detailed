import React, { useState } from 'react';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleWorkspaceChange = (workspace) => {
    setSelectedWorkspace(workspace);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={handleMenuToggle} />
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Header
          selectedWorkspace={selectedWorkspace}
          onWorkspaceChange={handleWorkspaceChange}
          onMenuToggle={handleMenuToggle}
        />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;