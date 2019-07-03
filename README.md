# greenhouse
Some sensors are read out and send to an mqtt broker for further processing.

## Wiring
* The DHT11 sensor on **GPIO 17**
* The DS18B20 sensor is read via **1-Wire**
* Capacitive Soil Moisture sensors are read via johnny five (Analog Pins of an Arduino Uno)

## MQTT
The Sensors are send to an mqtt broker in following topics:
* indoor temperature (DHT11) = **greenhouse/temperature/indoor**
* indoor humidity (DHT11) = **greenhouse/humidity/indoor**
* outdoor temperature (DS18B20) = **greenhouse/temperature/outdoor**
* soil moisture = **greenhouse/moisture/soil/*n***
  * average with **greenhouse/moisture/soil/average**
