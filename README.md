# TriFi
Trilateration of location via wifi hotspot signal strength analysis

## Client
Client runs on a device which is attached to the person being tracked (i.e. Raspberry Pi). Signal strength data is sent every second to the server.

## Server
Server runs on another device which runs the trilateration and signal analysis code to determine the location of the client.

## Viewer
Viewer is a website available from any web browser which allows the user to see a realtime view of the location of the client relative to the client coordinate system.

The viewer code is run on the same machine as the server.
