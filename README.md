# CodeCraft

A real-time collaborative code editor built for pair programming and technical interviews.

## Features

- Real-time code synchronization across all users in a room
- Multi-language support — JavaScript, Python, C++, Java
- Code execution with stdin/stdout support via Glot API
- Room-based collaboration with user presence tracking
- Language selection synced across all room members
- Output broadcast to all users when code is run
- Automatic room cleanup when all users leave
- Light/Dark theme toggle
- Dockerized for consistent local development

## Tech Stack

**Frontend**
- React + Vite
- Monaco Editor (@monaco-editor/react)
- Socket.io Client
- React Router

**Backend**
- Node.js + Express
- Socket.io
- Redis (Upstash) — pub/sub and room state
- MongoDB Atlas — persistent storage
- Glot API — sandboxed code execution

**DevOps**
- Docker + Docker Compose
- Deployed on Vercel (frontend) and Render (backend)

## Local Development

### Without Docker

```bash
# Backend
cd server
npm install
node index.js

# Frontend
cd client
npm install
npm run dev
```

### With Docker

```bash
docker-compose up --build
```

### Environment Variables

Create a `.env` file in the `server` folder:

PORT=5000

MONGO_URI=your_mongodb_connection_string

REDIS_URL=your_upstash_redis_url

GLOT_API_KEY=your_glot_api_key

## Architecture

- Users join rooms via a unique room ID
- Socket.io manages real-time events (code changes, user join/leave, language changes, code output)
- Redis stores active room state (users, current code, language)
- When the last user leaves, room data is deleted from Redis
- Code execution requests go through the backend to Glot API and output is broadcast to all room members
