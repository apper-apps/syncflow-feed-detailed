import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const QuickActions = ({ task, onRun, onRunMultiple, onToggle, onEdit, onDelete, enableParallel = false, selectedTasks = [] }) => {
  return (
<div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="small"
        icon="Play"
        onClick={() => onRun(task.Id)}
        className="text-green-600 hover:text-green-700 hover:bg-green-50"
        title="Run now"
      />
      {enableParallel && selectedTasks.length > 1 && (
        <Button
          variant="ghost"
          size="small"
          icon="PlayCircle"
          onClick={() => onRunMultiple(selectedTasks)}
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          title="Run selected tasks in parallel"
        />
      )}
      <Button
        variant="ghost"
        size="small"
        icon={task.status === 'disabled' ? 'Play' : 'Pause'}
        onClick={() => onToggle(task.Id)}
        className={`
          ${task.status === 'disabled' 
            ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50' 
            : 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50'
          }
        `}
        title={task.status === 'disabled' ? 'Enable' : 'Disable'}
      />
      <Button
        variant="ghost"
        size="small"
        icon="Edit"
        onClick={() => onEdit(task.Id)}
        className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
        title="Edit"
      />
      <Button
        variant="ghost"
        size="small"
        icon="Trash2"
        onClick={() => onDelete(task.Id)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        title="Delete"
      />
    </div>
  );
};

export default QuickActions;