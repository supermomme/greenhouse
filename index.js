const mosquitto = require('mqtt')
const five = require('johnny-five')
const dht11 = require('node-dht-sensor')
const ds18b20 = require('ds18b20')

//const board = new five.Board();
const mqtt  = mosquitto.connect('mqtt://192.168.1.232', {
  username: 'ubuntu',
  password: '1234'
})

const outdoorSensorId = '28-0315747704ff'
const sensorCrawlInterval = 60000

//Indoor Humidity and Temperature AND Outdoor Temperature
setInterval(function() {
  dht11.read(11, 17, function(err, temperature, humidity) {
    if (err) throw err;
    //console.log(temperature, humidity)
    mqtt.publish(`greenhouse/temperature/indoor`, temperature.toFixed(1).toString())
    mqtt.publish(`greenhouse/humidity/indoor`, humidity.toFixed(1).toString())
  })

  let outdoorTemperature = ds18b20.temperatureSync(outdoorSensorId)
  //console.log(outdoorTemperature)
  mqtt.publish(`greenhouse/temperature/outdoor`, outdoorTemperature.toString())
}, sensorCrawlInterval)


//Comming Soon

//Soil Moisture sensor via johnny five
/*board.on("ready", function() {

  // This requires OneWire support using the ConfigurableFirmata
  var thermometer = new five.Thermometer({
    controller: "DS18B20",
    pin: 2,
    freq: 1000
  });

  thermometer.on("data", function({celsius}) {
    //console.log(`${celsius} celsius`)
    //mqtt.publish(`greenhouse/temperature/outdoor`, celsius.toString())
  });
});*/
