var socket = io.connect('http://35.190.181.97');
socket.on('data', function (data) {
  /**
   * Data is in this format:
   * { clientPosition: [ 2.1, 1.1 ],
   *   beaconData: [
   *    { position: [ 0, 3 ], radius: '5' },
   *    { position: [ 0, 0 ], radius: '2' },
   *    { position: [ 3, 0 ], radius: '7' }
   *  ]
   * }
   */
  console.log(data);
});
