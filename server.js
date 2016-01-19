var PORT      = process.env.PORT || 3000;
var express   = require('express');
var app       = express();
var http      = require('http').Server(app);
var io        = require('socket.io')(http);
var moment    = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

function sendCurrentUsers(socket) {
  var info  = clientInfo[socket.id];
  var users = [];

  if (typeof info === 'undefined') {
    return;
  }

  Object.keys(clientInfo).forEach(function(socketId) {
    var userInfo = clientInfo[socketId];

    if (info.room === userInfo.room) {
      users.push(userInfo.name);
    }

    var $users = jQuery('.users');
    //var $user = jQuery('<li class="list-group-user"></li>');

    users.forEach(function(user) {
      $users.append('<li class="list-group-user">' + user + '</li>');
    });
    //$user.append(users.join);
    //socket.emit('message', {
    //name: 'Turing bot',
    //text: 'Current Users: ' + users.join(', '),
    //timestamp: moment().valueOf()
    //});
  });
}

function sendCurrentChannels(socket) {
  var channels = [];

  Object.keys(clientInfo).forEach(function(socketId) {
    var channelInfo = clientInfo[socketId];

    channels.push(channelInfo.room);

    socket.emit('message', {
      name: 'Turing bot',
      text: 'Current Channels: ' + channels.join(', '),
      timestamp: moment().valueOf()
    });
  });
}

io.on('connection', function(socket) {
  socket.on('disconnect', function() {
    var userData = clientInfo[socket.id];
    if (typeof userData !== 'undefined') {
      socket.leave(userData.room);
      io.to(userData.room).emit('message', {
        name: 'Turing bot',
        text: userData.name + ' has left!',
        timestamp: moment().valueOf()
      });
      delete clientInfo[socket.id];
    }
  });

  socket.on('joinRoom', function(req){
    clientInfo[socket.id] = req;
    socket.join(req.room);
    socket.broadcast.to(req.room).emit('message', {
      name: 'Turing bot',
      text: req.name + ' has joined #' + req.room,
      timestamp: moment().valueOf()
    });
  });

  socket.on('message', function(message) {
    if (message.text === '@currentUsers') {
      sendCurrentUsers(socket);
    } else if (message.text === '@currentChannels') {
      sendCurrentChannels(socket);
    } else {
      message.timestamp = moment().valueOf();
      io.to(clientInfo[socket.id].room).emit('message', message);
    }
  });

  socket.emit('message', {
    name: 'Turing bot',
    text: 'Welcome to the Turing chat application!',
    timestamp: moment().valueOf()
  });
});

http.listen(PORT, function() {
  console.log('Server started!');
});

module.exports = app
