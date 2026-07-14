const setupSocket = (io, redis) => {
    io.on("connection", (socket) => {

        socket.on("language-change", async ({ roomId, language }) => {
            await redis.set(`language:${roomId}`, language);
            io.to(roomId).emit("language-update", {language});
        });

        socket.on("join-room", async({roomId, username}) => {
            if(!username)return; // reject nameless users
            socket.join(roomId);
            socket.data.roomId = roomId;
            socket.data.username = username;

            // Get existing users Before adding new user
            const existingUsers = await redis.hvals(`room:${roomId}`);
            socket.emit("room-users", {users: existingUsers});
            
            // Only add if username not already in room
            if(!existingUsers.includes(username)) {
                await redis.hset(`room:${roomId}`, socket.id, username);
                socket.to(roomId).emit("user-joined", { username });
            }else {
                await redis.hset(`room:${roomId}`, socket.id, username);
            }
            // Set current code to newly joined user 
            const currentCode = await redis.get(`code:${roomId}`);
            if(currentCode) {
                socket.emit("code-update", {code: currentCode});
            }

            const currentLanguage = await redis.get(`language:${roomId}`);
            if(currentLanguage) {
                socket.emit("language-update", { language: currentLanguage});
            }
            
        });

        socket.on("code-change", async ({roomId, code}) => {
            await redis.set(`code:${roomId}`, code);
            socket.to(roomId).emit("code-update", { code });
        });

        socket.on("disconnect", async () => {
            const { roomId, username } = socket.data;
            if (roomId && username) {
                await redis.hdel(`room:${roomId}`, socket.id);

                // Check if room is now empty
                const remainingUsers = await redis.hvals(`room:${roomId}`);
                if (remainingUsers.length === 0) {
                    await redis.del(`room:${roomId}`);
                    await redis.del(`code:${roomId}`);
                    await redis.del(`language:${roomId}`);
                }

                io.to(roomId).emit("user-left", { username });
            }
        });

        socket.on("run-code", async({roomId, code, language, input, username}) => {
            try{
                const response = await fetch("http://localhost:5000/execute", {
                    method:"POST",
                    headers:{"Content-Type": "application/json"},
                    body: JSON.stringify({code, language, input}),
                });
                const data = await response.json();
                io.to(roomId).emit("code-output", {
                    output: data.output,
                    input: input,
                    ranBy: username
                });
            } catch(err) {
                io.to(roomId).emit("code-output", {output: "Execution failed"});
            }
        })
    });
};

module.exports = setupSocket;