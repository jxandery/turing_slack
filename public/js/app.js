var name    = getQueryVariable('name');
var room    = getQueryVariable('room');
var socket  = io();

socket.on('connect', function() {
  console.log('Connected to socket.io server');
});

socket.on('message', function(message) {
  var $message = jQuery('.messages');
  var momentTimestamp = moment.utc(message.timestamp);
  console.log('new message:');
  console.log(message.text);

  $message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong>: </p>');
  $message.append('<p>' + message.text + '</p>');
});

var $form = jQuery('#message-form');

$form.on('submit', function(event) {
  event.preventDefault();

  var $message = $form.find('input[name=message]');
  socket.emit('message', {
    name: name,
    text: $message.val()
  });

  $message.val('');

});
