# Real-Time Chat Application (PulseChat)

A full-stack real-time chat application built with the MERN stack featuring WebSocket communication, JWT authentication, responsive UI, and message persistence.

## Features

✅ **Real-time messaging** with Socket.IO  
✅ **User authentication** with JWT  
✅ **Chat rooms** (public) and **direct messages** (private)  
✅ **Media uploads** (images & files)  
✅ **Message history** persisted in MongoDB  
✅ **Responsive design** optimized for desktop and mobile  

## Tech Stack

**Frontend:**  
- React  
- Socket.IO Client  
- Vite  

**Backend:**  
- Node.js + Express  
- Socket.IO  
- MongoDB + Mongoose  
- JWT (authentication)  
- Multer (file uploads)  

---

## Setup & Installation

### 1. Clone or open this workspace

Clone this repository in your local device.

### 2. Install dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

### 3. Configure environment variables

**Server:** Copy `server/.env.example` to `server/.env` and update:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/realtime_chat
JWT_SECRET=replace_this_with_a_strong_secret
CLIENT_ORIGIN=http://localhost:5173
```

**Client:** Copy `client/.env.example` to `client/.env`:
```env
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

---

## Running the Application

### Start the Backend (Server)

```bash
cd server
npm run dev
```
Server will run on [http://localhost:4000](http://localhost:4000).

### Start the Frontend (Client)

Open a new terminal:
```bash
cd client
npm run dev
```
Client will run on [http://localhost:5173](http://localhost:5173).

---

## Usage

1. Open [http://localhost:5173](http://localhost:5173) in your browser  
2. **Create an account** or **sign in**  
3. **Create a room** or **start a direct message**  
4. **Send text messages** or **upload media files**  
5. All messages are **persisted** and visible on refresh  

---

## Project Structure

```
Real-time chat application/
├── server/                    # Backend (Express + Socket.IO)
│   ├── src/
│   │   ├── config/           # Database connection
│   │   ├── models/           # Mongoose schemas (User, Room, Message)
│   │   ├── routes/           # API routes (auth, rooms, uploads)
│   │   ├── middleware/       # JWT auth middleware
│   │   └── server.js         # Entry point
│   ├── uploads/              # File storage
│   └── package.json
│
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── services/         # API client
│   │   ├── state/            # AuthContext
│   │   ├── styles/           # CSS
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── public/               # Static assets
│   └── package.json
│
└── README.md
```

---

## API Endpoints

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| POST   | `/api/auth/register`        | Create new user          |
| POST   | `/api/auth/login`           | User login               |
| GET    | `/api/auth/me`              | Get current user         |
| GET    | `/api/rooms`                | List all rooms           |
| POST   | `/api/rooms`                | Create a new room        |
| POST   | `/api/rooms/direct`         | Start direct chat        |
| GET    | `/api/rooms/:id/messages`   | Get room messages        |
| POST   | `/api/rooms/:id/messages`   | Send message             |
| POST   | `/api/uploads`              | Upload file              |
