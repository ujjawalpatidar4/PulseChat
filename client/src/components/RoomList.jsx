export const RoomList = ({ user, rooms, activeRoom, onSelectRoom, onCreateRoom, onDirectRoom, loading }) => {
  return (
    <aside className="room-list">
      <div className="user-bar">
        <div className="avatar" style={{ background: user.avatarColor }}>
          {user.name[0]?.toUpperCase()}
        </div>
        <div className="flex-grow">
          <strong>{user.name}</strong>
          <p className="text-xs muted">{user.email}</p>
        </div>
      </div>
      <div className="actions">
        <button onClick={() => onDirectRoom(prompt('Enter user email:'))}>💬 Direct</button>
        <button onClick={() => onCreateRoom(prompt('Room name:'))}>➕ Room</button>
      </div>
      <div className="rooms">
        {loading && <div className="loading">Loading...</div>}
        {rooms.map((r) => (
          <div
            key={r._id}
            className={activeRoom?._id === r._id ? 'room active' : 'room'}
            onClick={() => onSelectRoom(r)}
          >
            <div className="room-icon">{r.isDirect ? '💬' : '#'}</div>
            <div className="flex-grow">
              <strong>{r.name}</strong>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
