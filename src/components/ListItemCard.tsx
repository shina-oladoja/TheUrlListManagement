import React, { useState } from 'react';

export default function ListItemCard({ item, listId, onDelete, onEdit, canEdit = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUrl, setEditedUrl] = useState(item.url);
  const [editedTitle, setEditedTitle] = useState(item.title || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = async () => {
    if (!editedUrl.trim()) return;
    
    try {
      new URL(editedUrl);
    } catch {
      alert('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    try {
      await onEdit(item.id, { url: editedUrl, title: editedTitle });
      setIsEditing(false);
    } catch (error) {
      console.error('Error editing item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    setIsLoading(true);
    try {
      await onDelete(item.id);
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing && canEdit) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
        <div className="space-y-3">
          <input
            type="text"
            value={editedUrl}
            onChange={(e) => setEditedUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="URL"
            disabled={isLoading}
          />
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="Title (optional)"
            disabled={isLoading}
          />
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={isLoading}
              className="flex-1 bg-gray-400 text-white py-1 px-3 rounded text-sm hover:bg-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
      <div className="flex gap-3">
        <div className="flex-1 min-w-0">
          {editedTitle && <p className="text-sm font-medium text-gray-700 mb-1">{editedTitle}</p>}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 break-all text-sm"
          >
            {item.url}
          </a>
          <p className="text-xs text-gray-500 mt-2">
            Added {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
        {canEdit && (
          <div className="flex gap-2 ml-2 flex-shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              disabled={isLoading}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
              disabled={isLoading}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
