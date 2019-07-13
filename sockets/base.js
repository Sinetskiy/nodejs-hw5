const cookie = require('cookie');

module.exports = function (io) {

    const clients = {};

    io.on('connection', socket => {

        const cookies = cookie.parse(socket.handshake.headers.cookie);

        clients[socket.id] = {id: socket.id, username: cookies.username};

        socket.json.emit('all users', clients);
        socket.broadcast.json.emit('new user', {id: socket.id, username: cookies.username});

        socket.join(cookies.username);

        socket.on('chat message', (message, user) => {
            console.log('m', message, 'u', user);
            socket.join(user);
            socket.broadcast.to(user).emit('chat message', message, user);
        });


        socket.on('disconnect', () => {
            console.log(clients);
            socket.broadcast.emit('delete user', socket.id);
            delete clients[socket.id];
        });
    });

}
