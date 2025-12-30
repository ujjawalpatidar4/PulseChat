import { useState, useRef } from 'react';
import { useAuth } from '../state/AuthContext.jsx';
import { upload } from '../services/api.js';

export const MessageComposer = ({ roomId, onSend }) => {
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const { token } = useAuth();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    console.log('Sending message:', content);
    await onSend({ content, mediaUrl: null, mediaType: null });
    setContent('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await upload(file, token);
      await onSend({ content: '', mediaUrl: data.url, mediaType: data.type });
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
      fileRef.current.value = '';
    }
  };

  return (
    <form className="message-composer" onSubmit={handleSend}>
      <input
        type="text"
        placeholder="Type a message…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={uploading}
      />
      <label className="icon-btn" title="Attach file">
        📎
        <input type="file" ref={fileRef} onChange={handleFileUpload} style={{ display: 'none' }} />
      </label>
      <button type="submit" disabled={uploading || !content.trim()}>
        {uploading ? '⏳' : '➤'}
      </button>
    </form>
  );
};
