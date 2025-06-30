import React from 'react';
import Badge from '@/components/atoms/Badge';

const StatusIndicator = ({ status, showIcon = true, size = 'medium' }) => {
  const statusConfig = {
    running: {
      variant: 'running',
      icon: showIcon ? 'Play' : null,
      pulse: true,
      text: 'Running'
    },
    success: {
      variant: 'success',
      icon: showIcon ? 'CheckCircle' : null,
      pulse: false,
      text: 'Success'
    },
    failed: {
      variant: 'error',
      icon: showIcon ? 'XCircle' : null,
      pulse: false,
      text: 'Failed'
    },
    pending: {
      variant: 'pending',
      icon: showIcon ? 'Clock' : null,
      pulse: false,
      text: 'Pending'
    },
    disabled: {
      variant: 'disabled',
      icon: showIcon ? 'Pause' : null,
      pulse: false,
      text: 'Disabled'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      pulse={config.pulse}
      size={size}
    >
      {config.text}
    </Badge>
  );
};

export default StatusIndicator;