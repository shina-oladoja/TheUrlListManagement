import React, { useState } from 'react';

export default function ListHeader({ list, onPublish, onDelete, canEdit = false, isLoading = false }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/${list.custom_url}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocial = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(list.title);
    let url = '';

    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=Check%20out%20my%20URL%20list:%20${encodedTitle}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodedTitle}&body=Check%20out%20my%20URL%20list:%20${encodedUrl}`;
        break;
    }

    if (url) window.open(url, '_blank');
  };

  return (
    <div class="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-6 rounded-lg shadow-lg">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h1 class="text-4xl font-bold mb-2">{list.title}</h1>
          {list.description && (
            <p class="text-indigo-100 text-lg">{list.description}</p>
          )}
        </div>
        {canEdit && (
          <div class="flex gap-2">
            {!list.is_published ? (
              <button
                onClick={onPublish}
                disabled={isLoading}
                class="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg font-medium"
              >
                Publish
              </button>
            ) : (
              <span class="bg-green-600 text-white py-2 px-4 rounded-lg font-medium">
                ✓ Published
              </span>
            )}
            <button
              onClick={onDelete}
              disabled={isLoading}
              class="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg font-medium"
            >
              Delete List
            </button>
          </div>
        )}
      </div>

      {list.is_published && (
        <div class="bg-indigo-700 p-4 rounded-lg">
          <p class="text-sm text-indigo-100 mb-3 font-semibold">📤 Share this list:</p>
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <code class="flex-1 bg-indigo-900 p-2 rounded text-sm break-all">
                {shareUrl}
              </code>
              <button
                onClick={copyToClipboard}
                class="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded font-medium flex-shrink-0 transition"
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
            
            <div class="flex gap-2 flex-wrap">
              <button
                onClick={() => shareOnSocial('twitter')}
                class="bg-blue-400 hover:bg-blue-500 text-white py-1 px-3 rounded text-sm font-medium transition"
                title="Share on Twitter"
              >
                𝕏
              </button>
              <button
                onClick={() => shareOnSocial('facebook')}
                class="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm font-medium transition"
                title="Share on Facebook"
              >
                f
              </button>
              <button
                onClick={() => shareOnSocial('linkedin')}
                class="bg-blue-700 hover:bg-blue-800 text-white py-1 px-3 rounded text-sm font-medium transition"
                title="Share on LinkedIn"
              >
                in
              </button>
              <button
                onClick={() => shareOnSocial('email')}
                class="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded text-sm font-medium transition"
                title="Share via email"
              >
                ✉️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
