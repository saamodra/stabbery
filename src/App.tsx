import { useState, useEffect } from 'react';
import { Server, Plus, Activity, TestTube } from 'lucide-react';
import { MockList } from './components/MockList';
import { MockForm } from './components/MockForm';
import { RequestLogs } from './components/RequestLogs';
import { EndpointTester } from './components/EndpointTester';
import { mockApi } from './api/mockApi';
import { Mock } from './types/mock';

type Tab = 'mocks' | 'create' | 'logs' | 'test';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('mocks');
  const [mocks, setMocks] = useState<Mock[]>([]);
  const [editingMock, setEditingMock] = useState<Mock | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMocks();
  }, []);

  const loadMocks = async () => {
    try {
      setLoading(true);
      const data = await mockApi.getAllMocks();
      setMocks(data);
    } catch (error) {
      console.error('Error loading mocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMockCreated = () => {
    loadMocks();
    setActiveTab('mocks');
    setEditingMock(null);
  };

  const handleEditMock = (mock: Mock) => {
    setEditingMock(mock);
    setActiveTab('create');
  };

  const handleDeleteMock = async (id: string) => {
    try {
      await mockApi.deleteMock(id);
      loadMocks();
    } catch (error) {
      console.error('Error deleting mock:', error);
    }
  };

  const tabs = [
    { id: 'mocks', label: 'Mock Endpoints', icon: Server },
    { id: 'create', label: editingMock ? 'Edit Mock' : 'Create Mock', icon: Plus },
    { id: 'test', label: 'Test Endpoint', icon: TestTube },
    { id: 'logs', label: 'Request Logs', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Server className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Stabbery</h1>
                <p className="text-sm text-slate-500">Dynamic API endpoint management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                Server Running
              </div>
              <span>localhost:3001</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as Tab);
                    if (tab.id !== 'create') setEditingMock(null);
                  }}
                  className={`flex items-center space-x-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'mocks' && (
          <MockList
            mocks={mocks}
            loading={loading}
            onEdit={handleEditMock}
            onDelete={handleDeleteMock}
            onRefresh={loadMocks}
          />
        )}

        {activeTab === 'create' && (
          <MockForm
            mock={editingMock}
            onSuccess={handleMockCreated}
            onCancel={() => {
              setActiveTab('mocks');
              setEditingMock(null);
            }}
          />
        )}

        {activeTab === 'test' && <EndpointTester />}

        {activeTab === 'logs' && <RequestLogs />}
      </main>
    </div>
  );
}

export default App;
