var socket = io.connect('http://35.190.181.97');
socket.on('data', function ({ data }) {
  /**
   * Data is in this format:
   * {
   * data: { clientPosition: [ 2.1, 1.1 ],
   *   beaconData: [
   *    { position: [ 0, 3 ], radius: '5' },
   *    { position: [ 0, 0 ], radius: '2' },
   *    { position: [ 3, 0 ], radius: '7' }
   *  ]
   * }
   * }
   */
   console.log(data);

   showIt([
     data.clientPosition[0],
     data.clientPosition[1],
   ]);

    plotIt([
      data.clientPosition[0] / 2,
      data.clientPosition[1] / 2,
      data.beaconData[0].position[0] / 2,
      data.beaconData[0].position[1] / 2,
      data.beaconData[0].radius * 2,
      data.beaconData[1].position[0] / 2,
      data.beaconData[1].position[1] / 2,
      data.beaconData[1].radius * 2,
      data.beaconData[2].position[0] / 2,
      data.beaconData[2].position[1] / 2,
      data.beaconData[0].radius * 2,
    ]);
});
