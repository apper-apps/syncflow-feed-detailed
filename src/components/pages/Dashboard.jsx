import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import StatusIndicator from '@/components/molecules/StatusIndicator';
import QuickActions from '@/components/molecules/QuickActions';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { taskService } from '@/services/api/taskService';
import { executionService } from '@/services/api/executionService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [tasksData, executionsData] = await Promise.all([
        taskService.getAll(),
        executionService.getAll()
      ]);
      setTasks(tasksData);
      setExecutions(executionsData.slice(0, 5)); // Recent 5 executions
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunTask = async (taskId) => {
    try {
      await taskService.runTask(taskId);
      toast.success('Task execution started successfully');
      loadDashboardData();
    } catch (err) {
      toast.error('Failed to start task execution');
    }
};

  const handleRunMultipleTasks = async (taskIds) => {
    try {
      toast.info(`Starting ${taskIds.length} tasks in parallel...`);
      const results = await taskService.runMultipleTasks(taskIds);
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      if (failed === 0) {
        toast.success(`All ${successful} tasks started successfully`);
      } else {
        toast.warning(`${successful} tasks started, ${failed} failed`);
      }
      loadDashboardData();
    } catch (err) {
      toast.error('Failed to start parallel task execution');
    }
  };
  const handleToggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      const newStatus = task.status === 'disabled' ? 'enabled' : 'disabled';
      await taskService.update(taskId, { status: newStatus });
      toast.success(`Task ${newStatus} successfully`);
      loadDashboardData();
    } catch (err) {
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(taskId);
        toast.success('Task deleted successfully');
        loadDashboardData();
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const stats = {
    totalTasks: tasks.length,
    activeTasks: tasks.filter(t => t.status !== 'disabled').length,
    runningTasks: tasks.filter(t => t.status === 'running').length,
    successfulExecutions: executions.filter(e => e.status === 'success').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Monitor and manage your Airbyte sync orchestration</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            as={Link}
            to="/tasks/create"
            variant="primary"
            icon="Plus"
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="ListTodo" className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Total Tasks</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalTasks}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="CheckCircle" className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600">Active Tasks</p>
                <p className="text-2xl font-bold text-green-900">{stats.activeTasks}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Play" className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-yellow-600">Running</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.runningTasks}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Activity" className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">Success Rate</p>
                <p className="text-2xl font-bold text-purple-900">
                  {executions.length > 0 ? Math.round((stats.successfulExecutions / executions.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Overview */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
              <Button
                as={Link}
                to="/tasks"
                variant="ghost"
                size="small"
                icon="ArrowRight"
                iconPosition="right"
              >
                View All
              </Button>
            </div>

            {tasks.length === 0 ? (
              <Empty
                title="No tasks created yet"
                message="Create your first sync orchestration task to get started with automating your Airbyte pipelines."
                actionLabel="Create Task"
                onAction={() => window.location.href = '/tasks/create'}
                icon="ListTodo"
              />
            ) : (
              <div className="space-y-4">
                {tasks.slice(0, 5).map((task, index) => (
                  <motion.div
                    key={task.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">{task.name}</h3>
                        <StatusIndicator status={task.status} size="small" />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
                          {task.cronSchedule}
                        </span>
                        <span className="flex items-center">
                          <ApperIcon name="Network" className="w-3 h-3 mr-1" />
                          {task.connections?.length || 0} connections
                        </span>
                      </div>
                    </div>
<QuickActions
                      task={task}
                      onRun={handleRunTask}
                      onRunMultiple={handleRunMultipleTasks}
                      onToggle={handleToggleTask}
                      onEdit={(id) => window.location.href = `/tasks/${id}`}
                      onDelete={handleDeleteTask}
                      enableParallel={false}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Recent Executions */}
        <div>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Executions</h2>
              <Button
                as={Link}
                to="/executions"
                variant="ghost"
                size="small"
                icon="ArrowRight"
                iconPosition="right"
              >
                View All
              </Button>
            </div>

            {executions.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Activity" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No executions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {executions.map((execution, index) => (
                  <motion.div
                    key={execution.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <StatusIndicator status={execution.status} size="small" showIcon={false} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {execution.taskName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(execution.startTime), 'MMM d, HH:mm')}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {execution.duration}
                    </div>
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

export default Dashboard;