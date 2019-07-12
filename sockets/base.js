module.exports = function (io) {

    const clients = {0: {id:0,username: "andrey"}};
    let count = 0;

    io.on('connection', socket => {
        const id = count++;
        clients[id] = socket.id;
        console.log(clients);

        socket.send({
            type: 'hello',
            message: `Hello you id is ${id}`,
            data: id
        });

        socket.broadcast.send({
            type: 'info',
            message: clients
        });

        socket.on('all users', message => {
            socket.broadcast.send({
                type: 'message',
                message: clients,
                author: id
            });
        })

        socket.on('message', message => {
            socket.send({
                type: 'message',
                message: message,
                author: id
            });
            socket.broadcast.send({
                type: 'message',
                message: message,
                author: id
            });
        });

        socket.on('disconnect', () => {
            delete clients[id];
        });
    });

}
