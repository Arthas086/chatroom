const socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('newMessage', (message) => {
    var li = document.createElement('li');
    li.innerText = `${message.from}: ${message.text}`;
    document.getElementById('list').appendChild(li);
});
socket.on('newLocation', (location) => {
    var li = document.createElement('li');
    li.innerHTML = `${location.from}: <a href="https://maps.google.com/?q=${location.latitude},${location.longitude}" target="_blank">Location</a>`
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

function getLocation() {
    if (!navigator.geolocation) {
        return alert('unable to get your location')
    }
    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position);
        socket.emit('createLocation', {
            from: 'user',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function () {
        alert('location access denied!');
    })
}
