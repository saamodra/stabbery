import React, { useState, useEffect } from 'react';
import { Save, X, AlertCircle, CheckCircle } from 'lucide-react';
import { JsonEditor } from './JsonEditor';
import { mockApi } from '../api/mockApi';

interface MockFormProps {
  mock?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const MockForm: React.FC<MockFormProps> = ({ mock, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    path: '',
    method: 'GET',
    request_headers: {},
    request_body_schema: {},
    response_status: 200,
    response_headers: { 'Content-Type': 'application/json' },
    response_body: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (mock) {
      setFormData({
        path: mock.path || '',
        method: mock.method || 'GET',
        request_headers: mock.request_headers || {},
        request_body_schema: mock.request_body_schema || {},
        response_status: mock.response_status || 200,
        response_headers: mock.response_headers || { 'Content-Type': 'application/json' },
        response_body: mock.response_body || {}
      });
    }
  }, [mock]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mock) {
        await mockApi.updateMock(mock.id, formData);
        setSuccess('Mock endpoint updated successfully!');
      } else {
        await mockApi.createMock(formData);
        setSuccess('Mock endpoint created successfully!');
      }
      
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {mock ? 'Edit Mock Endpoint' : 'Create Mock Endpoint'}
          </h2>
          <p className="text-slate-600 mt-1">
            Configure the mock response for incoming requests
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-900">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-green-900">Success</h3>
              <p className="text-sm text-green-700 mt-1">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Basic Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                HTTP Method
              </label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {methods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Response Status Code
              </label>
              <input
                type="number"
                min="100"
                max="599"
                value={formData.response_status}
                onChange={(e) => setFormData({ ...formData, response_status: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              URL Path
            </label>
            <input
              type="text"
              value={formData.path}
              onChange={(e) => setFormData({ ...formData, path: e.target.value })}
              placeholder="/api/users/123"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              required
            />
            <p className="text-sm text-slate-500 mt-1">
              The path must start with a forward slash (/)
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Request Configuration</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Expected Request Headers
              </label>
              <JsonEditor
                value={formData.request_headers}
                onChange={(value) => setFormData({ ...formData, request_headers: value })}
                placeholder='{\n  "Authorization": "Bearer token",\n  "Content-Type": "application/json"\n}'
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Request Body Schema
              </label>
              <JsonEditor
                value={formData.request_body_schema}
                onChange={(value) => setFormData({ ...formData, request_body_schema: value })}
                placeholder='{\n  "name": "string",\n  "email": "string"\n}'
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Response Configuration</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Response Headers
              </label>
              <JsonEditor
                value={formData.response_headers}
                onChange={(value) => setFormData({ ...formData, response_headers: value })}
                placeholder='{\n  "Content-Type": "application/json",\n  "X-Custom-Header": "value"\n}'
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Response Body
              </label>
              <JsonEditor
                value={formData.response_body}
                onChange={(value) => setFormData({ ...formData, response_body: value })}
                placeholder='{\n  "success": true,\n  "data": {\n    "message": "Hello World"\n  }\n}'
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Saving...' : mock ? 'Update Mock' : 'Create Mock'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};