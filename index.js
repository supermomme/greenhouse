var mosquitto = require('mqtt')
var five = require("johnny-five");

var board = new five.Board();
var mqtt  = mosquitto.connect('mqtt://192.168.1.232', {
  username: 'ubuntu',
  password: '1234'
})

board.on("ready", function() {

  // This requires OneWire support using the ConfigurableFirmata
  var thermometer = new five.Thermometer({
    controller: "DS18B20",
    pin: 2,
    freq: 1000
  });

  thermometer.on("data", function({celsius}) {
    console.log(`${celsius} celsius`)
    mqtt.publish(`greenhouse/temperature/indoor`, celsius.toString())
  });
});