import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './state/AuthContext.jsx';
import { api } from './services/api.js';
import { LoginPanel } from './components/LoginPanel.jsx';
import { ChatShell } from './components/ChatShell.jsx';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

export default function App() {
  const { token, user, setAuth } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loadingRooms, setLoadingRooms] = useState(false);

  useEffect(() => {
    if (!token) return;
    console.log('Connecting to Socket.IO server at:', SOCKET_URL);
    const instance = io(SOCKET_URL, { auth: { token } });
    
    instance.on('connect', () => {
      console.log('Socket.IO connected successfully');
    });
    
    instance.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err.message);
    });
    
    instance.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
    });
    
    setSocket(instance);
    return () => instance.disconnect();
  }, [token]);

  useEffect(() => {
    if (!socket) return;
    const handleMessage = (message) => {
      console.log('Received message:', message, 'Active room:', activeRoom?._id);
      const messageRoomId = typeof message.room === 'object' ? message.room._id || message.room : message.room;
      const activeRoomId = activeRoom?._id;
      
      if (messageRoomId?.toString() === activeRoomId?.toString()) {
        setMessages((prev) => [...prev, message]);
      }
      
      setRooms((prev) => prev.map((r) => {
        const roomId = r._id?.toString();
        const msgRoomId = messageRoomId?.toString();
        return roomId === msgRoomId ? { ...r, lastMessageAt: message.createdAt || new Date() } : r;
      }));
    };
    
    socket.on('message', handleMessage);
    return () => socket.off('message', handleMessage);
  }, [socket, activeRoom]);

  useEffect(() => {
    if (!token) return;
    const loadRooms = async () => {
      setLoadingRooms(true);
      const data = await api.get('/rooms', token);
      setRooms(data.rooms || []);
      setLoadingRooms(false);
    };
    loadRooms();
  }, [token]);

  const handleAuth = async (mode, payload) => {
    const data = await api.post(`/auth/${mode}`, payload);
    setAuth(data.token, data.user);
  };

  const handleSelectRoom = async (room) => {
    setActiveRoom(room);
    if (!room) {
      setMessages([]);
      return;
    }
    
    console.log('Selecting room:', room._id);
    const data = await api.get(`/rooms/${room._id}/messages`, token);
    setMessages(data.messages || []);
    
    if (socket) {
      socket.emit('join', room._id);
      console.log('Joined room:', room._id);
    }
  };

  const handleSendMessage = async ({ content, mediaUrl, mediaType }) => {
    if (!activeRoom) return;
    console.log('Emitting message to socket:', { roomId: activeRoom._id, content, mediaUrl, mediaType });
    socket?.emit('message', { roomId: activeRoom._id, content, mediaUrl, mediaType });
  };

  const handleCreateRoom = async (name) => {
    const data = await api.post('/rooms', { name }, token);
    setRooms((prev) => [data.room, ...prev]);
  };

  const handleDirectRoom = async (email) => {
    const data = await api.post('/rooms/direct', { email }, token);
    const exists = rooms.find((r) => r._id === data.room._id);
    const list = exists ? rooms : [data.room, ...rooms];
    setRooms(list);
    handleSelectRoom(data.room);
  };

  const handleLogout = () => {
    socket?.disconnect();
    setSocket(null);
    setRooms([]);
    setActiveRoom(null);
    setMessages([]);
    setAuth(null, null);
  };

  if (!token || !user) {
    return <LoginPanel onAuth={handleAuth} />;
  }

  return (
    <ChatShell
      user={user}
      rooms={rooms}
      activeRoom={activeRoom}
      messages={messages}
      onSelectRoom={handleSelectRoom}
      onSend={handleSendMessage}
      onCreateRoom={handleCreateRoom}
      onDirectRoom={handleDirectRoom}
      onLogout={handleLogout}
      loadingRooms={loadingRooms}
    />
  );
}
