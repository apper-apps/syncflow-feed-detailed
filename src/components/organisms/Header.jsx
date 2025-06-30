import React from 'react';
import Button from '@/components/atoms/Button';
import WorkspaceSelector from '@/components/molecules/WorkspaceSelector';
import ApperIcon from '@/components/ApperIcon';

const Header = ({ selectedWorkspace, onWorkspaceChange, onMenuToggle }) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="small"
              icon="Menu"
              onClick={onMenuToggle}
              className="lg:hidden -ml-2 mr-2"
            />
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <h2 className="text-lg font-semibold text-gray-900">
                  Airbyte Sync Orchestration
                </h2>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <WorkspaceSelector
              selectedWorkspace={selectedWorkspace}
              onWorkspaceChange={onWorkspaceChange}
            />
            <div className="h-6 border-l border-gray-300" />
            <Button
              variant="ghost"
              size="small"
              icon="Bell"
              className="text-gray-500 hover:text-gray-700"
            />
            <Button
              variant="ghost"
              size="small"
              icon="HelpCircle"
              className="text-gray-500 hover:text-gray-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;