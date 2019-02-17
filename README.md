# ble-spinbike
This project is about building a "smart" spinbike from a low-cost, standard spinbike, thus saving a lot of money and having a lot of fun building it and riding it. The result is a spinbike that will work with popular on-line virtual exercise applications, such as Zwift and Bkool. This project was developed specifically using Zwift, but should work with any other product that supports standard Bluetooth GATT technology.

Spinbike is a Javascript node.js application that runs on a Raspberry Pi 3 W. It gathers data from sensors attached to a spinbike and feeds the data over a bluetooth LE connection to client applications, using the Bluetooth LE (Low Energy) GATT protocol. The GATT protocol is recognized by all major online virtual exercise platforms.

This project provides three of the main exercise bike services: Cadence/Speed, Power and Control. Online apps generally require at least Cadence/Speed or Power in order to allow you to connect and participate. Control is optional, and generally involves feeding the bike information about wind speed road resistance and grade so it can adjust the effort required by the rider. You can build as much or as little as you want. 

Here is the fritzing diagram for the Raspberry PI, sensors and controllers:

![](images/SpinBike_bb.png)

I chose a Yosuda spin bike for this project:

![](images/yosuda.png)

It has three attributes that make it nice for installing the sensors we need, and the optional stepper motor for controlling resistance:

* A magnet on the main drive pulley and a hole just below the crankshaft where a Hall sensor can be mounted for measuring cadence.
* A steering head that is extended below the main frame, providing a perfect location to mount the load cell for measuring the force on the wool brake pad from the front wheel. 
* A flat-sided steering head and a tension shaft located in just the right spot for making it easy to mount the optional stepper motor, which replaces the tension knob and allows for computerized resistance control.


## System Diagram

This is how the software pieces fit together:

![](images/spinbikesoftwarediagram.png)

Although most cycling applications support ANT as well as Bluetooth LE (hereafter referred to as "BLE"), I chose Bluetooth for a couple reasons:

* We're using a spinbike, which is indoors and stationary. We don't need the robustness of ANT that's better suited for outdoors and real bicycles. 
* We can use conventional, built-in bluetooth devices, thus avoiding the added cost of ANT dongles.

The major components of this project are the spin bike, a tablet (iPad or Android), a Raspberry Pi, and about $50 in sensors/misc. hardware. You can also use a standard Mac or PC in place of the tablet, but a tablet works better because you can mount it on the handlebars.

Although you don't need the latest computer equipment for this, you also can't use antiques. I specify the Raspberry Pi 3 W because it has built-in bluetooth. Old iPads won't run the Zwift app. On the other hand, I had no problem using a 2007 iMac. You'll have to experiment.





