const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const Redis = require("ioredis");

dotenv.config();

const app = express();
const server = http.createServer(app);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const io = new Server(server, {
    cors: {
        origin: CLIENT_ORIGIN,
        methods: ["GET", "POST"],
    },
});


const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", ()=> console.log("Redis connected"));
redis.on("error", (err)=> console.log("Redis error", err));

app.use(cors({
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"]
}));
app.use(express.json());

const executeRoute = require("./routes/execute");
app.use("/execute", executeRoute);

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=> console.log("MongoDB connected"))
    .catch((err)=>console.log("Mongodb error : ", err));

const setupSocket = require("./socket/handlers");
setupSocket(io, redis);

const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=> {
    console.log(`server running on port ${PORT}`);
});