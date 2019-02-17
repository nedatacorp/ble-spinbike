# ble-spinbike
Javascript/node.js solution for adapting spin bikes to work with on-line virtual cycling applications, such as Zwift and Bkool.

Spinbike is a Javascript node.js application that runs on a Raspberry Pi 3 W. It gathers data from sensors attached to a spinbike and feeds the data over a bluetooth LE connection to client applications, using the Bluetooth LE (Low Energy) GATT protocol. The GATT protocol is recognized by all major online virtual exercise platforms.

Here is the fritzing diagram for the Raspberry PI, sensors and controllers:

![](images/SpinBike_bb.png)

I chose a Yosuda spin bike for this project:

![](images/yosuda.png)

It has three attributes that make it nice for installing the sensors we need, and the optional stepper motor for controlling resistance:

* A magnet on the main drive pulley and a hole just below the crankshaft where a Hall sensor can be mounted for measuring cadence.
* A steering head that is extended below the main frame, providing a perfect location to mount the load cell for measuring the force on the wool brake pad from the front wheel. 
* A flat-sided steering head and a tension shaft located in just the right spot for making it easy to mount the optional stepper motor, which replaces the tension knob and allows for computerized resistance control.


