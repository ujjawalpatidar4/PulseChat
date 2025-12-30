export const RoomList = ({ user, rooms, activeRoom, onSelectRoom, onCreateRoom, onDirectRoom, loading, onLogout, sidebarOpen, onToggleSidebar, onDeleteRoom }) => {
  const handleSelectRoom = (room) => {
    onSelectRoom(room);
    if (window.innerWidth < 768 && sidebarOpen) {
      onToggleSidebar();
    }
  };

  const handleDirectMsg = () => {
    const email = prompt('Enter user email:');
    if (email && email.trim()) onDirectRoom(email.trim());
  };

  const handleCreateRoomClick = () => {
    const name = prompt('Room name:');
    if (name && name.trim()) onCreateRoom(name.trim());
  };

  const handleDeleteRoom = (e, room) => {
    e.stopPropagation();
    onDeleteRoom(room);
  };

  return (
    <aside className={sidebarOpen ? 'room-list visible' : 'room-list'}>
      <div className="user-bar">
        <div className="avatar" style={{ background: user.avatarColor }}>
          {user.name[0]?.toUpperCase()}
        </div>
        <div className="flex-grow">
          <strong>{user.name}</strong>
          <p className="text-xs muted">{user.email}</p>
        </div>
        <button className="icon-btn" onClick={onLogout} title="Logout">
          ↩
        </button>
      </div>
      <div className="actions">
        <button onClick={handleDirectMsg}>💬 Direct</button>
        <button onClick={handleCreateRoomClick}>➕ Room</button>
      </div>
      <div className="rooms">
        {loading && <div className="loading">Loading...</div>}
        {rooms.map((r) => (
          <div
            key={r._id}
            className={activeRoom?._id === r._id ? 'room active' : 'room'}
            onClick={() => handleSelectRoom(r)}
          >
            <div className="room-icon">{r.isDirect ? '💬' : '#'}</div>
            <div className="flex-grow">
              <strong>{r.name}</strong>
            </div>
            <button 
              className="room-delete-btn" 
              onClick={(e) => handleDeleteRoom(e, r)} 
              title="Delete room"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
};
