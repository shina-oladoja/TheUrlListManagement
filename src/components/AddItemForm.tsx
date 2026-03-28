import React, { useState } from 'react';

export default function AddItemForm({ onSubmit, isLoading = false }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('URL is required');
      return;
    }

    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    await onSubmit({ url, title });
    setUrl('');
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded-lg shadow-md">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What is this link about?"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 font-medium"
      >
        {isLoading ? 'Adding...' : '+ Add URL'}
      </button>
    </form>
  );
}
