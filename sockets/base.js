module.exports = function (io) {

    const clients = {};

    io.on('connection', socket => {
        clients[socket.id] = {id: socket.id, username: socket.id};

        socket.json.emit('all users', clients);
        socket.broadcast.json.emit('new user', {id: socket.id, username: 'user' + socket.id});

        socket.join(socket.id);

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
