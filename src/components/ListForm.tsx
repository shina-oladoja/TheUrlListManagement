import React, { useState } from 'react';

interface ListFormProps {
  onSubmit?: (data: any) => void;
  initialTitle?: string;
  initialDesc?: string;
  initialUrl?: string;
  isLoading?: boolean;
}

export default function ListForm({ onSubmit, initialTitle = '', initialDesc = '', initialUrl = '', isLoading: externalLoading = false }: ListFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDesc);
  const [customUrl, setCustomUrl] = useState(initialUrl);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(externalLoading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, customUrl })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to the list edit page
        window.location.href = `/list/${data.list.id}`;
      } else {
        setError(data.error || 'Failed to create list');
      }
    } catch (err) {
      setError('Failed to create list');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      {error && <div className="text-red-600 bg-red-100 p-3 rounded">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">List Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My awesome list"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this list about?"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Custom URL (optional)</label>
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">urlist.app/</span>
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            placeholder="my-list"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate</p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium"
      >
        {isLoading ? 'Creating...' : 'Create List'}
      </button>
    </form>
  );
}
