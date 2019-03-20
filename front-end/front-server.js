const socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('newMessage', (message) => {
    console.log(message);
    var li = document.createElement('li');
    li.innerText = `${message.from}: ${message.text}`;
    console.log(li.value);
    document.getElementById('list').appendChild(li);
});

function sender() {
    var text = document.getElementById('message').value;
    document.getElementById('message').value = "";
    socket.emit('createMessage', {
        from: 'user',
        text
    }, function (data) {
    });
}
