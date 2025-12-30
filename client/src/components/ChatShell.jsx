import { useMemo } from 'react';
import { RoomList } from './RoomList.jsx';
import { MessageFeed } from './MessageFeed.jsx';
import { MessageComposer } from './MessageComposer.jsx';
import { useAuth } from '../state/AuthContext.jsx';

export const ChatShell = ({ user, rooms, activeRoom, messages, onSelectRoom, onSend, onCreateRoom, onDirectRoom, loadingRooms }) => {
  const sortedRooms = useMemo(
    () => [...rooms].sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0)),
    [rooms]
  );

  return (
    <div className="chat-shell">
      <RoomList
        user={user}
        rooms={sortedRooms}
        activeRoom={activeRoom}
        onSelectRoom={onSelectRoom}
        onCreateRoom={onCreateRoom}
        onDirectRoom={onDirectRoom}
        loading={loadingRooms}
      />
      <div className="chat-panel">
        {activeRoom ? (
          <>
            <header className="chat-header">
              <div>
                <p className="eyebrow">{activeRoom.isDirect ? 'Direct' : 'Room'}</p>
                <h3>{activeRoom.name}</h3>
              </div>
              <div className="badge">{activeRoom.isDirect ? 'Private' : 'Shared'}</div>
            </header>
            <MessageFeed messages={messages} currentUserId={user.id} />
            <MessageComposer roomId={activeRoom._id} onSend={onSend} />
          </>
        ) : (
          <div className="empty">
            <p>Select or create a room to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};
