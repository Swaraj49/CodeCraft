import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const socket = io(SERVER_URL, {
    autoConnect: false, // By default Socket.io connects immediately when the file is imported. We don't want that — we want to connect only when the user enters a room with a username. So we disable auto connect and manually call socket.connect() later.
});

export default socket;
