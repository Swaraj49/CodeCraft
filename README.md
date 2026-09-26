# 🚀 CodeCraft

A powerful, real-time collaborative code editor designed for pair programming, technical interviews, and seamless team collaboration. 

CodeCraft provides an interactive environment where multiple developers can write, execute, and debug code simultaneously within the same room. By broadcasting language selections, code execution output, and user presence, CodeCraft creates a synchronized and highly productive coding experience.

---

## ✨ Key Features

- **⚡ Real-Time Synchronization**: Instantly syncs code across all active users in a room with sub-second latency.
- **🌐 Multi-Language Support**: Write and execute code in JavaScript, Python, C++, and Java.
- **▶️ Live Code Execution**: Integrated with Glot API to run code in secure sandboxes with custom standard input (stdin) support. 
- **👥 Room-Based Collaboration**: Users can create or join unique rooms. Real-time presence tracking shows who enters or leaves.
- **🔄 Shared State**: Language selections and execution outputs are broadcasted to all users in the room automatically.
- **🧹 Automatic Cleanup**: Room state and data are safely removed from memory (Redis) when the last user disconnects.
- **🎨 Theming**: Built-in Light and Dark mode toggles for a personalized IDE experience.
- **🐳 Docker Ready**: Consistent and isolated local development environment powered by Docker Compose.

---

## 🛠️ Tech Stack

CodeCraft is built using modern web technologies to ensure a scalable and robust architecture.

### **Frontend**
- **React.js & Vite**: Lightning-fast UI rendering and module bundling.
- **Monaco Editor**: The core engine behind VS Code, providing syntax highlighting and advanced code editing capabilities (`@monaco-editor/react`).
- **Socket.io-client**: Handles bidirectional, real-time communication with the backend.
- **React Router**: Client-side routing for navigating between the home screen and active rooms.

### **Backend**
- **Node.js & Express.js**: Fast, scalable server handling HTTP endpoints and WebSockets.
- **Socket.io**: Real-time event engine broadcasting code changes and presence data.
- **Redis (Upstash)**: High-performance in-memory datastore acting as a Pub/Sub message broker and maintaining active room states (current code, language, and user lists).
- **MongoDB Atlas**: Persistent NoSQL database storage.
- **Glot API**: Executes arbitrary code safely within isolated, language-specific containers.

### **DevOps & Deployment**
- **Docker & Docker Compose**: Containerized environment for frictionless local setup.
- **Vercel**: Hosts the optimized frontend build.
- **Render**: Hosts the real-time backend API.

---

## 🏗️ System Architecture & Workflow

1. **Room Creation/Join**: A user enters a unique Room ID. The client establishes a WebSocket connection via Socket.io.
2. **State Management**: Redis stores the room's current state (active users, code snippet, selected language). New users automatically pull the latest state upon joining.
3. **Collaboration**: Code changes and cursor events are pushed to the backend and broadcasted to all clients in the room instantly.
4. **Execution**: When a user hits "Run", the backend proxies the code to the Glot API. The resulting standard output/error is fetched and broadcasted globally to everyone in the room.
5. **Teardown**: When the final participant leaves the room, the backend performs a cleanup routine, deleting the room data from Redis to optimize memory.

---

## 🚀 Local Development

Follow these steps to get CodeCraft running on your local machine.

### Prerequisites
- Node.js (v18+)
- Docker (optional, but recommended)
- A MongoDB cluster URI
- An Upstash Redis URI
- A Glot API token

### 🔧 Method 1: Without Docker

**1. Setup the Backend**
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and configure the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
REDIS_URL=your_upstash_redis_url
GLOT_API_KEY=your_glot_api_key
```

Start the backend server:
```bash
npm run dev
# or: node index.js
```

**2. Setup the Frontend**
```bash
cd client
npm install
npm run dev
```
The frontend will typically run on `http://localhost:5173`.

### 🐳 Method 2: With Docker (Recommended)

If you have Docker installed, you can spin up the entire stack with a single command:

```bash
# Ensure your .env files are configured as mentioned above.
docker-compose up --build
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check the [issues page](#) if you want to contribute.

## 📝 License

This project is licensed under the MIT License.
