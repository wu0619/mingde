import serial
import time

print("Start")
# This will be different for various devices and on windows it will probably be a COM port.
port = "COM4"
# Start communications with the bluetooth unit
bluetooth = serial.Serial(port, 9600)
print("Connected")
bluetooth.flushInput()  # This gives the bluetooth a little kick

for i in range(5):  # send 5 groups of data to the bluetooth
    if i == 0:
        bluetooth.write(b"LED ON")  # Turn Off the LED
    else:
        # These need to be bytes not unicode, plus a number
        bluetooth.write(b"DATA "+str.encode(str(i)))
    # This reads the incoming data. In this particular example it will be the "Bluetooth answers" line
    input_data = bluetooth.readline()
    # These are bytes coming in so a decode is needed
    print(input_data.decode())
    time.sleep(0.1)  # A pause between bursts

# Turn Off the LED, but no answer back from Bluetooth will be printed by python
bluetooth.write(b"LED OFF")

bluetooth.close()  # Otherwise the connection will remain open until a timeout which ties up the /dev/thingamabob
print("Done")
