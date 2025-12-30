import { useEffect, useRef } from 'react';

export const MessageFeed = ({ messages, currentUserId }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="message-feed">
      {messages.map((msg) => {
        const isMe = msg.sender?.id === currentUserId || msg.sender?._id === currentUserId;
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
                <img src={`http://localhost:4000${msg.mediaUrl}`} alt="uploaded" className="media-img" />
              )}
              {msg.mediaUrl && !msg.mediaType?.startsWith('image') && (
                <a href={`http://localhost:4000${msg.mediaUrl}`} target="_blank" rel="noreferrer">
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
