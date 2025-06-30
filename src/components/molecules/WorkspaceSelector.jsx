import React, { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import { workspaceService } from '@/services/api/workspaceService';

const WorkspaceSelector = ({ selectedWorkspace, onWorkspaceChange }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      setLoading(true);
      const data = await workspaceService.getAll();
      setWorkspaces(data);
      if (data.length > 0 && !selectedWorkspace) {
        onWorkspaceChange(data[0]);
      }
    } catch (error) {
      console.error('Failed to load workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkspaceSelect = (workspace) => {
    onWorkspaceChange(workspace);
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-400">
        <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading workspaces...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <ApperIcon name="Building2" className="w-4 h-4" />
        <span>{selectedWorkspace?.name || 'Select Workspace'}</span>
        <ApperIcon name="ChevronDown" className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="py-1">
            {workspaces.map((workspace) => (
              <button
                key={workspace.Id}
                onClick={() => handleWorkspaceSelect(workspace)}
                className={`
                  w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between
                  ${selectedWorkspace?.Id === workspace.Id ? 'bg-primary-50 text-primary-600' : 'text-gray-700'}
                `}
              >
                <div>
                  <div className="font-medium">{workspace.name}</div>
                  <div className="text-xs text-gray-500">{workspace.description}</div>
                </div>
                {selectedWorkspace?.Id === workspace.Id && (
                  <ApperIcon name="Check" className="w-4 h-4 text-primary-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceSelector;