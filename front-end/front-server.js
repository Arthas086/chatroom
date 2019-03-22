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
    li.innerHTML = `${location.from}: <a href="https://maps.google.com/?q=${location.latitude},${location.longitude}" target="_blank">Location</a>`;
    document.getElementById('list').appendChild(li);
});


function sender() {
    var text = document.getElementById('message').value;
    socket.emit('createMessage', {
        from: 'user',
        text
    }, function () {
        document.getElementById('message').value = "";
    });
}

function getLocation() {
    var location = document.getElementById('location');
    if (!navigator.geolocation) {
        return alert('unable to get your location')
    }
    location.disabled = true;
    location.value = "Sending...";
    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocation', {
            from: 'user',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },function () {
            location.disabled = false;
            location.value = "Location";
        })
    }, function () {
        alert('location access denied!');
        location.disabled = false;
        location.value = "Location";

    })
}
function load() {
    var peoplePanel = document.getElementById('peoplePanel');
    peoplePanel.style.height = window.innerHeight + "px";
    peoplePanel.style.width = window.innerWidth/6 + "px";
    peoplePanel.style.backgroundSize = window.innerWidth/6 + "px " + window.innerHeight + "px";
    var messagePanel = document.getElementById('messagePanel');
    messagePanel.style.height = window.innerHeight + "px";
    messagePanel.style.width = 5*window.innerWidth/6 + "px";
    messagePanel.style.left = (window.innerWidth/6 + 5) + "px";
    messagePanel.style.backgroundSize = 5*window.innerWidth/6 + "px " + window.innerHeight + "px";
    var message = document.getElementById('message');
    message.style.width = (5*window.innerWidth/6 - 210) + "px";
    message.focus();
    document.getElementById('send').style.left = (5+5*window.innerWidth/6 - 210) + "px";
    document.getElementById('location').style.left = (5+5*window.innerWidth/6 - 210 + 70) + "px";
    document.getElementById('input').style.top = (window.innerHeight - 40) + "px";
    var messages = document.getElementById('messages');
    messages.style.height = (window.innerHeight - 60) + "px";
    messages.style.width = (5*window.innerWidth/6 - 30) + "px";
}
function keyClick(event) {
    if(event.keyCode === 13){
        sender();
    }
}
