var socket = io();
var userId = "user";

$("#power-button").on('click', function(e){
    socket.emit('toggle power', {value: 0, userId: userId});
});

socket.on('toggle power', function(msg) {
    if(msg.value === false) {
        $('#messages').prepend($('<li>Toogle LED: OFF<span> - '+msg.userId+'</span></li>'));
        $("#led-container").removeClass("on");
        $("#led-container").addClass("off");
        $("#led-container span").text("OFF");
    }
    else if(msg.value === true) {
        $('#messages').prepend($('<li>Toogle LED: ON<span> - '+msg.userId+'</span></li>'));
        $("#led-container").removeClass("off");
        $("#led-container").addClass("on");
        $("#led-container span").text("ON");
    }
});
