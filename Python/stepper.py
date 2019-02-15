import RPi.GPIO as GPIO
from time import sleep
import sys

#12 = IN1  - On 1 & 4, we get 3v, 0 on 2 and 3
#11 = IN2  - On 2 & 3, we get 3v, 0 on 1 and 4
#13 = IN3  - On 1 & 2m we get 3v, 0 on 3 and 4
#16 = IN4  - 0 all the time
#assign GPIO pins for motor

motor_channel = (12,13,11,16)
 
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
#for defining more than 1 GPIO channel as input/output use
GPIO.setup(motor_channel, GPIO.OUT)

motor_direction = raw_input('select motor direction a=anticlockwise, c=clockwise: ')

print('motor direction: ' + motor_direction)

while True:
    try:
        if(motor_direction == 'c'):
            print('motor running clockwise\n')
            GPIO.output(motor_channel, (GPIO.HIGH,GPIO.HIGH,GPIO.LOW,GPIO.LOW))
            sleep(0.02) 
            GPIO.output(motor_channel, (GPIO.LOW,GPIO.HIGH,GPIO.HIGH,GPIO.LOW))
            sleep(0.02)  
            GPIO.output(motor_channel, (GPIO.LOW,GPIO.LOW,GPIO.HIGH,GPIO.HIGH))
            sleep(0.02) 
            GPIO.output(motor_channel, (GPIO.HIGH,GPIO.LOW,GPIO.LOW,GPIO.HIGH))
            sleep(0.02)   

        elif(motor_direction == 'a'):
            print('motor running anti-clockwise\n')
            GPIO.output(motor_channel, (GPIO.HIGH,GPIO.LOW,GPIO.LOW,GPIO.HIGH))
            sleep(0.02)
            GPIO.output(motor_channel, (GPIO.LOW,GPIO.LOW,GPIO.HIGH,GPIO.HIGH))
            sleep(0.02)
            GPIO.output(motor_channel, (GPIO.LOW,GPIO.HIGH,GPIO.HIGH,GPIO.LOW))
            sleep(0.02)
            GPIO.output(motor_channel, (GPIO.HIGH,GPIO.HIGH,GPIO.LOW,GPIO.LOW))
            sleep(0.02)

            
    #press ctrl+c for keyboard interrupt
    except KeyboardInterrupt:
        #query for setting motor direction or exit
        motor_direction = raw_input('select motor direction a=anticlockwise, c=clockwise or q=exit: ')
        #check for exit
        if(motor_direction == 'q'):
            print('motor stopped')
            sys.exit(0)
 

