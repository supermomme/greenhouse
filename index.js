const mosquitto = require('mqtt')
const five = require('johnny-five')
//const dht11 = require('node-dht-sensor')
//const ds18b20 = require('ds18b20')

const board = new five.Board();
const mqtt  = mosquitto.connect('mqtt://192.168.1.232', {
  username: 'ubuntu',
  password: '1234'
})

const outdoorSensorId = '28-0315747704ff'
const sensorCrawlInterval = 15000

//Indoor Humidity and Temperature AND Outdoor Temperature
setInterval(function() {
  dht11.read(11, 17, function(err, temperature, humidity) {
    if (err) throw err;
    //console.log(temperature, humidity)
    mqtt.publish(`greenhouse/temperature/indoor`, temperature.toFixed(1).toString(), {retain: true})
    mqtt.publish(`greenhouse/humidity/indoor`, humidity.toFixed(1).toString(), {retain: true})
  })

  let outdoorTemperature = ds18b20.temperatureSync(outdoorSensorId)
  //console.log(outdoorTemperature)
  mqtt.publish(`greenhouse/temperature/outdoor`, outdoorTemperature.toString(), {retain: true})
}, sensorCrawlInterval)


//Soil Moisture sensor via johnny five
board.on("ready", function() {
  let latestData = [0, 0, 0, 0, 0]
  var moisture = [
    new five.Sensor({pin: "A0", freq: sensorCrawlInterval}),
    new five.Sensor({pin: "A1", freq: sensorCrawlInterval}),
    new five.Sensor({pin: "A2", freq: sensorCrawlInterval}),
    new five.Sensor({pin: "A3", freq: sensorCrawlInterval}),
    new five.Sensor({pin: "A4", freq: sensorCrawlInterval}),
  ]
  moisture.forEach((sensor, sensorId) => {
    sensor.on('data', (data) => {
      let low = 300;
      let high = 600;
      let percentage = Math.round((1 - (data-low)/(high-low)) * 1000) / 10
      latestData[sensorId] = percentage
    })
  })

  setInterval(function() {
    latestData.forEach((data, sensorId) => {
      mqtt.publish(`greenhouse/moisture/soil/${sensorId}`, data.toString(), {retain: true})
      //console.log(`${sensorId}: ${data}`)
    })
    let average = Math.round(latestData.reduce((pv, cr) => pv + cr, 0) / latestData.length * 10) / 10
    mqtt.publish(`greenhouse/moisture/soil/average`, average.toString(), {retain: true})
    //console.log(`average: ${average}`)
  }, sensorCrawlInterval)


});
