//require mraa
var mraa = require('mraa');

 //write the mraa version to the Intel XDK console
console.log('MRAA Version: ' + mraa.getVersion());

//LED hooked up to digital pin 13
var myOnboardLed = new mraa.Gpio(13);

//set the gpio direction to output
myOnboardLed.dir(mraa.DIR_OUT);

//Booleans to hold the state of Led and Power
var ledState = false;
var power_on = false;

var myMotorPin = new mraa.Pwm(9);
myMotorPin.enable(true);
myMotorPin.period_us(62500);
var motorSpeed = 0;
myMotorPin.write(motorSpeed);
myOnboardLed.write(0);

var blueLEd = new mraa.Pwm(5);
blueLEd.enable(true);
myMotorPin.period_us(62500);
blueLEd.write(0.5);

var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res) {
    //Join all arguments together and normalize the resulting path.
    res.sendFile(path.join(__dirname + '/client', 'index.html'));
});

//Allow use of files in client folder
app.use(express.static(__dirname + '/client'));
app.use('/client', express.static(__dirname + '/client'));

//Socket.io Event handlers
io.on('connection', function(socket) {

    socket.on('toggle power', function(msg) {
        ledState = !ledState; //invert the ledState
        power_on = !power_on;
        myOnboardLed.write(ledState?1:0); //if ledState is true then write a '1' (high) otherwise write a '0' (low)
        msg.value = ledState;
        msg.powerstate = power_on;
        io.emit('toggle power', msg);
    });

    socket.on('motor power', function(msg){
        //console.log(msg);
        if(power_on){
            motorSpeed = (msg.value / 255);
            myMotorPin.write(motorSpeed);
        } else {
            myMotorPin.write(0);
        }
    });

    socket.on('weather', function(msg){
        //console.log(msg.value[0].current.humidity);
        blueLEd.write(msg.value[0].current.humidity / 100);
    });

});


http.listen(3000, function(){
    console.log('Web server Active listening on *:3000');
});
