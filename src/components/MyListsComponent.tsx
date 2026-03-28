import React, { useState, useEffect } from 'react';

interface List {
  id: number;
  title: string;
  description: string;
  custom_url: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export default function MyListsComponent() {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/all-lists');
      const data = await response.json();
      
      if (data.success) {
        setLists(data.lists);
      } else {
        setError('Failed to load lists');
      }
    } catch (err) {
      console.error('Error loading lists:', err);
      setError('Error loading lists');
    } finally {
      setLoading(false);
    }
  };

  const copyShareUrl = (customUrl: string) => {
    const shareUrl = `${window.location.origin}/${customUrl}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(lists.find(l => l.custom_url === customUrl)?.id || null);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteList = async (id: number) => {
    if (!confirm('Are you sure you want to delete this list?')) return;
    
    try {
      const response = await fetch(`/api/lists/${id}`, { method: 'DELETE' });
      if (response.ok) {
        loadLists();
      } else {
        alert('Failed to delete list');
      }
    } catch (err) {
      console.error('Error deleting list:', err);
      alert('Error deleting list');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading your lists...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-12">{error}</div>;
  }

  if (lists.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg mb-4">You haven't created any lists yet</p>
        <a href="/create" className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700">
          Create Your First List
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4">
        {lists.map((list) => (
          <div key={list.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{list.title}</h3>
                {list.description && (
                  <p className="text-gray-600 mt-1">{list.description}</p>
                )}
              </div>
              <div className="flex gap-2 ml-4 flex-shrink-0">
                {list.is_published && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Published
                  </span>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <p>Created: {new Date(list.created_at).toLocaleDateString()}</p>
              <p className="mt-1">URL: <code className="bg-gray-100 px-2 py-1 rounded">{list.custom_url}</code></p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <a
                href={`/list/${list.id}`}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-sm font-medium"
              >
                Edit List
              </a>
              {list.is_published && (
                <>
                  <button
                    onClick={() => copyShareUrl(list.custom_url)}
                    className={`py-2 px-4 rounded text-sm font-medium transition-colors ${
                      copiedId === list.id
                        ? 'bg-green-600 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {copiedId === list.id ? '✓ Copied!' : '📋 Copy Share Link'}
                  </button>
                  <a
                    href={`/${list.custom_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 text-sm font-medium"
                  >
                    🌐 View Public
                  </a>
                </>
              )}
              <button
                onClick={() => deleteList(list.id)}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
