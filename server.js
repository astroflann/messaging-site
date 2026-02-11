const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));


let onlineUsers = {};

console.log("Release V1.2, extra data {NONE}")

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);


    socket.emit('online users', Object.values(onlineUsers));

    socket.on('mark online', (data) => {
        onlineUsers[socket.id] = data.username;
        console.log('server received mark online:', data.username);

 
        io.emit('mark online', { username: data.username });
    });

    socket.on('chat message', (data) => {
        io.emit('chat message', data);
        console.log('chat message sent', data);
    });

    socket.on('disconnect', () => {
        const username = onlineUsers[socket.id];
        if (username) {
            delete onlineUsers[socket.id];
            io.emit('user disconnected', { username });
            console.log('User disconnected:', username);
        }
    });
});

http.listen(3000, () => console.log('Server running on port 3000'));
