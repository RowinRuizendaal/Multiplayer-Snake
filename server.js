const express = require('express')
const app = express()
const http = require('http').createServer(app)
const router = require('./routes/router');
const io = require('socket.io')(http)

const port = process.env.PORT || 3000;

app.use(router);
app.use(express.static(`${__dirname}/public`));

app.set('view engine', 'ejs');
app.set('views', 'view');

io.on('connection', (socket) => {
    console.log('user connected');
    let roomId = '';
    // socket.join(roomId)

    socket.on('message', (message) => {
        socket.to(roomId).emit('message', message)
    })

    socket.on('joinRoom', (id) => {
        // leave room first
        socket.leave(roomId)

        // reassign room id
        roomId = id

        // join room with new id
        socket.join(roomId)

        // Get ammount of active members within a room
        const count = io.sockets.adapter.rooms.get(`${roomId}`).size
        console.log(`RoomId: ${roomId} count: ${count}`)
            // socket.to(roomId).emit('count', count)
        socket.broadcast.emit('count', count)
    })


    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
})


http.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});