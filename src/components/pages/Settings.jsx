import React, { useState } from 'react';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('airbyte');
  const [airbyteConfig, setAirbyteConfig] = useState({
    apiUrl: 'https://api.airbyte.com/v1',
    clientId: '',
    clientSecret: '',
    connected: false
  });

  const [webhookConfig, setWebhookConfig] = useState({
    defaultUrl: '',
    defaultHeaders: '{}',
    retryAttempts: 3,
    timeoutSeconds: 30
  });

  const [notificationConfig, setNotificationConfig] = useState({
    emailEnabled: false,
    slackEnabled: false,
    discordEnabled: false,
    webhookEnabled: true
  });

  const tabs = [
    { id: 'airbyte', name: 'Airbyte API', icon: 'Zap' },
    { id: 'webhooks', name: 'Webhooks', icon: 'Webhook' },
    { id: 'notifications', name: 'Notifications', icon: 'Bell' },
    { id: 'general', name: 'General', icon: 'Settings' }
  ];

  const handleAirbyteTest = async () => {
    try {
      // Simulate API test
      toast.info('Testing Airbyte connection...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAirbyteConfig(prev => ({ ...prev, connected: true }));
      toast.success('Airbyte connection successful!');
    } catch (error) {
      toast.error('Failed to connect to Airbyte API');
    }
  };

  const handleSaveSettings = async (section) => {
    try {
      toast.info('Saving settings...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`${section} settings saved successfully!`);
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const renderAirbyteSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Airbyte API Configuration</h3>
        <div className="space-y-4">
          <Input
            label="API URL"
            value={airbyteConfig.apiUrl}
            onChange={(e) => setAirbyteConfig(prev => ({ ...prev, apiUrl: e.target.value }))}
            placeholder="https://api.airbyte.com/v1"
          />
          
          <Input
            label="Client ID"
            value={airbyteConfig.clientId}
            onChange={(e) => setAirbyteConfig(prev => ({ ...prev, clientId: e.target.value }))}
            placeholder="Enter your Airbyte client ID"
          />
          
          <Input
            label="Client Secret"
            type="password"
            value={airbyteConfig.clientSecret}
            onChange={(e) => setAirbyteConfig(prev => ({ ...prev, clientSecret: e.target.value }))}
            placeholder="Enter your Airbyte client secret"
          />

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${airbyteConfig.connected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium">
                Connection Status: {airbyteConfig.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <Button
              variant="outline"
              size="small"
              onClick={handleAirbyteTest}
              disabled={!airbyteConfig.clientId || !airbyteConfig.clientSecret}
            >
              Test Connection
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => handleSaveSettings('Airbyte')}
        >
          Save Airbyte Settings
        </Button>
      </div>
    </div>
  );

  const renderWebhookSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Webhook Configuration</h3>
        <div className="space-y-4">
          <Input
            label="Default Webhook URL"
            value={webhookConfig.defaultUrl}
            onChange={(e) => setWebhookConfig(prev => ({ ...prev, defaultUrl: e.target.value }))}
            placeholder="https://your-webhook-endpoint.com/webhook"
            type="url"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Headers
            </label>
            <textarea
              value={webhookConfig.defaultHeaders}
              onChange={(e) => setWebhookConfig(prev => ({ ...prev, defaultHeaders: e.target.value }))}
              rows={4}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
              placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Retry Attempts"
              type="number"
              value={webhookConfig.retryAttempts}
              onChange={(e) => setWebhookConfig(prev => ({ ...prev, retryAttempts: parseInt(e.target.value) }))}
              min="1"
              max="10"
            />
            
            <Input
              label="Timeout (seconds)"
              type="number"
              value={webhookConfig.timeoutSeconds}
              onChange={(e) => setWebhookConfig(prev => ({ ...prev, timeoutSeconds: parseInt(e.target.value) }))}
              min="5"
              max="300"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => handleSaveSettings('Webhook')}
        >
          Save Webhook Settings
        </Button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {Object.entries(notificationConfig).map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <ApperIcon 
                  name={key === 'emailEnabled' ? 'Mail' : key === 'slackEnabled' ? 'MessageSquare' : key === 'discordEnabled' ? 'MessageCircle' : 'Webhook'} 
                  className="w-5 h-5 text-gray-600" 
                />
                <div>
                  <p className="font-medium text-gray-900">
                    {key.replace('Enabled', '').charAt(0).toUpperCase() + key.replace('Enabled', '').slice(1)} Notifications
                  </p>
                  <p className="text-sm text-gray-500">
                    Receive notifications via {key.replace('Enabled', '')}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setNotificationConfig(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => handleSaveSettings('Notification')}
        >
          Save Notification Settings
        </Button>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
        <div className="space-y-6">
          <Card className="p-4">
            <h4 className="font-medium text-gray-900 mb-3">Application Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Version:</span>
                <Badge variant="info">v1.0.0</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Environment:</span>
                <Badge variant="success">Production</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">API Status:</span>
                <Badge variant="success">Online</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium text-gray-900 mb-3">Data Management</h4>
            <div className="space-y-3">
              <Button variant="outline" icon="Download" className="w-full">
                Export All Data
              </Button>
              <Button variant="outline" icon="Upload" className="w-full">
                Import Configuration
              </Button>
              <Button variant="danger" icon="Trash2" className="w-full">
                Clear All Data
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium text-gray-900 mb-3">System Health</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <div className="text-green-600">Uptime</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">2.3s</div>
                <div className="text-blue-600">Avg Response</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Configure your sync orchestration platform</p>
      </div>

      {/* Settings Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <Card className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <ApperIcon name={tab.icon} className="mr-3 h-5 w-5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Card className="p-6">
            {activeTab === 'airbyte' && renderAirbyteSettings()}
            {activeTab === 'webhooks' && renderWebhookSettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'general' && renderGeneralSettings()}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;