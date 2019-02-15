#!/usr/bin/python

import time
import RPi.GPIO as GPIO

hallpin = 26
ledpin = 13

count = 0

def sensorCallback(channel):
    global count
    
    if GPIO.input(channel):
      # No magnet
      GPIO.output(ledpin, False)
    else:
      # Pin is low, so there is a Magnet nearby
      GPIO.output(ledpin,True)
      count = count + 1
      print("Count: " + str(count))


# Tell GPIO library to use GPIO references
GPIO.setmode(GPIO.BCM)

GPIO.setup(hallpin , GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.add_event_detect(hallpin, GPIO.FALLING, callback=sensorCallback, bouncetime=200)

GPIO.setup(ledpin, GPIO.OUT)
GPIO.output(ledpin, False)

# Get initial reading
sensorCallback(hallpin)

try:
    # Loop until CTRL-C
    while True :
      time.sleep(.2)
      GPIO.output(ledpin,False)
      time.sleep(.2)
      #GPIO.output(ledpin,True)

except KeyboardInterrupt:
    GPIO.cleanup()

