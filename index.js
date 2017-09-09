const express = require('express');
const WiFiControl = require('wifi-control');

WiFiControl.init({
  debug: true,
});

WiFiControl.scanForWiFi((err, networks) => {
  if (err) {
    console.log(err);
  }
  setupConnection(networks);
})

/**
 * Sets up connection
 * @param networks the found wifi networks
 */
function setupConnection(networks) {
  const networkCredentials = [
    {
      ssid: 'H Wildermuth',
      password: 'password',
    },
    {
      ssid: 'Nathan\'s iPhone',
      password: 'rickross',
    },
  ];
  rotateConnections(networkCredentials, 0)
}

/**
 * Rotates connection around the provided networks
 * @param networkCredentials connections to use
 * @param next the next network to use (index of credentials array)
 */
function rotateConnections(networkCredentials, next) {
  // Rotates connections
  if (next === networkCredentials.length) {
    next = 0;
  }
  // Disconnect from current wifi
  WiFiControl.resetWiFi((err, response) => {
    if (err) {
      console.log(err);
    }
    WiFiControl.connectToAP(networkCredentials[next], (err, response) => {
      if (err) {
        console.log(err);
      }
      console.log(response);
      setTimeout(() => rotateConnections(networkCredentials, next + 1), 5000);
    });
  });
}
