import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import StatusIndicator from '@/components/molecules/StatusIndicator';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { taskService } from '@/services/api/taskService';
import { executionService } from '@/services/api/executionService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const TaskDetail = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTaskDetail();
  }, [id]);

  const loadTaskDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const [taskData, executionData] = await Promise.all([
        taskService.getById(parseInt(id)),
        executionService.getByTaskId(parseInt(id))
      ]);
      setTask(taskData);
      setExecutions(executionData);
    } catch (err) {
      setError('Failed to load task details');
      console.error('Task detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunTask = async () => {
    try {
      await taskService.runTask(task.Id);
      toast.success('Task execution started successfully');
      loadTaskDetail();
    } catch (err) {
      toast.error('Failed to start task execution');
    }
  };

  const handleToggleTask = async () => {
    try {
      const newStatus = task.status === 'disabled' ? 'enabled' : 'disabled';
      await taskService.update(task.Id, { status: newStatus });
      toast.success(`Task ${newStatus} successfully`);
      loadTaskDetail();
    } catch (err) {
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(task.Id);
        toast.success('Task deleted successfully');
        window.history.back();
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTaskDetail} />;
  if (!task) return <Error message="Task not found" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="small"
            icon="ArrowLeft"
            onClick={() => window.history.back()}
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{task.name}</h1>
            <p className="text-gray-600">{task.description}</p>
          </div>
          <StatusIndicator status={task.status} />
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="accent"
            icon="Play"
            onClick={handleRunTask}
            disabled={task.status === 'running'}
          >
            Run Now
          </Button>
          <Button
            variant="outline"
            icon={task.status === 'disabled' ? 'Play' : 'Pause'}
            onClick={handleToggleTask}
          >
            {task.status === 'disabled' ? 'Enable' : 'Disable'}
          </Button>
          <Button
            variant="outline"
            icon="Edit"
            as={Link}
            to={`/tasks/edit/${task.Id}`}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            icon="Trash2"
            onClick={handleDeleteTask}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Task Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Name
                </label>
                <p className="text-gray-900">{task.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <StatusIndicator status={task.status} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workspace
                </label>
                <p className="text-gray-900">{task.workspaceName || 'Default Workspace'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule
                </label>
                <p className="text-gray-900 font-mono text-sm">{task.cronSchedule}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <p className="text-gray-900">{task.description}</p>
              </div>
            </div>
          </Card>

          {/* Connections */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Connections ({task.connections?.length || 0})
            </h2>
            
            {task.connections && task.connections.length > 0 ? (
              <div className="space-y-3">
                {task.connections.map((connection, index) => (
                  <motion.div
                    key={connection.connectionId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Network" className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{connection.connectionName}</h4>
                        <p className="text-sm text-gray-600">
                          {connection.sourceName} → {connection.destinationName}
                        </p>
                      </div>
                    </div>
                    <Badge variant="info" size="small">
                      Active
                    </Badge>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Network" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No connections configured</p>
              </div>
            )}
          </Card>

          {/* Webhook Configuration */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Webhook Configuration</h2>
            
            {task.webhookUrl ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Webhook URL
                  </label>
                  <p className="text-gray-900 font-mono text-sm bg-gray-50 p-2 rounded">
                    {task.webhookUrl}
                  </p>
                </div>
                
                {task.webhookHeaders && Object.keys(task.webhookHeaders).length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Headers
                    </label>
                    <div className="bg-gray-50 p-3 rounded">
                      {Object.entries(task.webhookHeaders).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1">
                          <span className="font-mono text-sm text-gray-600">{key}:</span>
                          <span className="font-mono text-sm text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Webhook" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No webhook configured</p>
              </div>
            )}
          </Card>
        </div>

        {/* Execution History */}
        <div>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Executions</h2>
            
            {executions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Activity" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No executions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {executions.slice(0, 10).map((execution, index) => (
                  <motion.div
                    key={execution.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <StatusIndicator status={execution.status} size="small" showIcon={false} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {format(new Date(execution.startTime), 'MMM d, HH:mm')}
                        </p>
                        <p className="text-xs text-gray-500">
                          Duration: {execution.duration || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="small"
                      icon="ExternalLink"
                      className="text-gray-400 hover:text-gray-600"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;