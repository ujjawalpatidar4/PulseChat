import { useEffect, useRef } from 'react';

const SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

export const MessageFeed = ({ messages, currentUserId }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="message-feed">
      {messages.map((msg) => {
        const isMe = msg.sender?.id === currentUserId || msg.sender?._id === currentUserId;
        if (msg.mediaUrl) {
          console.log('Media URL:', msg.mediaUrl, 'Full URL:', `${SERVER_URL}${msg.mediaUrl}`, 'Type:', msg.mediaType);
        }
        return (
          <div key={msg._id} className={isMe ? 'message me' : 'message'}>
            {!isMe && (
              <div className="avatar" style={{ background: msg.sender?.avatarColor }}>
                {msg.sender?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="message-content">
              {!isMe && <strong>{msg.sender?.name}</strong>}
              {msg.content && <p>{msg.content}</p>}
              {msg.mediaUrl && msg.mediaType?.startsWith('image') && (
                <img 
                  src={`${SERVER_URL}${msg.mediaUrl}`} 
                  alt="uploaded" 
                  className="media-img"
                  onLoad={() => console.log('Image loaded successfully:', `${SERVER_URL}${msg.mediaUrl}`)}
                  onError={(e) => console.error('Image failed to load:', `${SERVER_URL}${msg.mediaUrl}`, e)}
                />
              )}
              {msg.mediaUrl && !msg.mediaType?.startsWith('image') && (
                <a href={`${SERVER_URL}${msg.mediaUrl}`} target="_blank" rel="noreferrer">
                  📎 Download file
                </a>
              )}
              <span className="timestamp">{new Date(msg.createdAt).toLocaleTimeString()}</span>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
};
