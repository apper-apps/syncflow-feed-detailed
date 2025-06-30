import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "No data found", 
  message = "Get started by creating your first item.", 
  actionLabel = "Get Started",
  onAction = null,
  icon = "Database"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        {onAction && (
          <Button
            variant="primary"
            onClick={onAction}
            icon="Plus"
            className="w-full"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;