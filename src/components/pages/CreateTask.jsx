import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { taskService } from '@/services/api/taskService';
import { workspaceService } from '@/services/api/workspaceService';
import { connectionService } from '@/services/api/connectionService';
import { toast } from 'react-toastify';

const CreateTask = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    workspaceId: '',
    cronSchedule: '0 0 * * *',
    webhookUrl: '',
    webhookHeaders: {},
    connections: []
  });

  // Step data
  const [workspaces, setWorkspaces] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedConnections, setSelectedConnections] = useState([]);

  const steps = [
    { id: 1, name: 'Basic Info', icon: 'FileText' },
    { id: 2, name: 'Workspace & Connections', icon: 'Network' },
    { id: 3, name: 'Schedule', icon: 'Clock' },
    { id: 4, name: 'Webhook', icon: 'Webhook' },
    { id: 5, name: 'Review', icon: 'CheckCircle' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = async () => {
    if (currentStep === 2 && formData.workspaceId && !connections.length) {
      await loadConnections();
    }
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const loadWorkspaces = async () => {
    try {
      const data = await workspaceService.getAll();
      setWorkspaces(data);
    } catch (error) {
      toast.error('Failed to load workspaces');
    }
  };

  const loadConnections = async () => {
    try {
      const data = await connectionService.getByWorkspaceId(formData.workspaceId);
      setConnections(data);
    } catch (error) {
      toast.error('Failed to load connections');
    }
  };

  const handleConnectionToggle = (connection) => {
    setSelectedConnections(prev => {
      const exists = prev.find(c => c.connectionId === connection.Id);
      if (exists) {
        return prev.filter(c => c.connectionId !== connection.Id);
      } else {
        return [...prev, {
          connectionId: connection.Id,
          connectionName: connection.name,
          sourceName: connection.sourceName,
          destinationName: connection.destinationName
        }];
      }
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const taskData = {
        ...formData,
        connections: selectedConnections,
        status: 'enabled'
      };
      
      const newTask = await taskService.create(taskData);
      toast.success('Task created successfully');
      navigate(`/tasks/${newTask.Id}`);
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (currentStep === 2) {
      loadWorkspaces();
    }
  }, [currentStep]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <Input
                  label="Task Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter task name"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe what this task does..."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Workspace & Connections</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Workspace
                  </label>
                  <select
                    value={formData.workspaceId}
                    onChange={(e) => handleInputChange('workspaceId', e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
                  >
                    <option value="">Choose a workspace</option>
                    {workspaces.map(workspace => (
                      <option key={workspace.Id} value={workspace.Id}>
                        {workspace.name}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.workspaceId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Connections
                    </label>
                    {connections.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <ApperIcon name="Network" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No connections found in this workspace</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {connections.map((connection) => (
                          <div
                            key={connection.Id}
                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleConnectionToggle(connection)}
                          >
                            <input
                              type="checkbox"
                              checked={selectedConnections.some(c => c.connectionId === connection.Id)}
                              onChange={() => handleConnectionToggle(connection)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-3"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{connection.name}</h4>
                              <p className="text-sm text-gray-600">
                                {connection.sourceName} → {connection.destinationName}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cron Expression
                  </label>
                  <Input
                    value={formData.cronSchedule}
                    onChange={(e) => handleInputChange('cronSchedule', e.target.value)}
                    placeholder="0 0 * * *"
                    className="font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {formData.cronSchedule} (Daily at midnight)
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Common Schedules</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Every hour', value: '0 * * * *' },
                      { label: 'Daily at midnight', value: '0 0 * * *' },
                      { label: 'Weekly on Sunday', value: '0 0 * * 0' },
                      { label: 'Monthly on 1st', value: '0 0 1 * *' }
                    ].map((schedule) => (
                      <button
                        key={schedule.value}
                        onClick={() => handleInputChange('cronSchedule', schedule.value)}
                        className="block w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50"
                      >
                        <span className="font-medium">{schedule.label}</span>
                        <span className="text-gray-500 ml-2 font-mono">{schedule.value}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Webhook Configuration</h3>
              <div className="space-y-4">
                <Input
                  label="Webhook URL"
                  value={formData.webhookUrl}
                  onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
                  placeholder="https://your-webhook-endpoint.com/webhook"
                  type="url"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Headers (Optional)
                  </label>
                  <textarea
                    value={JSON.stringify(formData.webhookHeaders, null, 2)}
                    onChange={(e) => {
                      try {
                        const headers = JSON.parse(e.target.value);
                        handleInputChange('webhookHeaders', headers);
                      } catch {
                        // Invalid JSON, don't update
                      }
                    }}
                    rows={4}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                    placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter headers as JSON format
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Configuration</h3>
              
              <div className="space-y-4">
                <Card className="p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Name:</span> {formData.name}</p>
                    <p><span className="text-gray-600">Description:</span> {formData.description}</p>
                  </div>
                </Card>

                <Card className="p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-2">Connections</h4>
                  <div className="space-y-1 text-sm">
                    {selectedConnections.map((connection) => (
                      <p key={connection.connectionId}>
                        {connection.connectionName} ({connection.sourceName} → {connection.destinationName})
                      </p>
                    ))}
                  </div>
                </Card>

                <Card className="p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-2">Schedule</h4>
                  <p className="text-sm font-mono">{formData.cronSchedule}</p>
                </Card>

                {formData.webhookUrl && (
                  <Card className="p-4 bg-gray-50">
                    <h4 className="font-medium text-gray-900 mb-2">Webhook</h4>
                    <p className="text-sm font-mono break-all">{formData.webhookUrl}</p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="small"
          icon="ArrowLeft"
          onClick={() => navigate('/tasks')}
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
          <p className="text-gray-600">Set up a new sync orchestration task</p>
        </div>
      </div>

      {/* Step Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2
                  ${currentStep >= step.id
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                  }
                `}
              >
                <ApperIcon name={step.icon} className="w-5 h-5" />
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'}`}>
                  {step.name}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 ml-4 ${currentStep > step.id ? 'bg-primary-500' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Step Content */}
      <Card className="p-6">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderStepContent()}
        </motion.div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          icon="ArrowLeft"
        >
          Previous
        </Button>
        
        <div className="flex space-x-3">
          {currentStep < steps.length ? (
            <Button
              variant="primary"
              onClick={handleNext}
              icon="ArrowRight"
              iconPosition="right"
              disabled={
                (currentStep === 1 && (!formData.name || !formData.description)) ||
                (currentStep === 2 && (!formData.workspaceId || selectedConnections.length === 0))
              }
            >
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={loading}
              icon="Check"
            >
              Create Task
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTask;