const express = require('express');
const WiFiControl = require('wifi-control');

const networkCredentials = [
  {
    ssid: 'H Wildermuth',
    password: 'password',
  },
  {
    ssid: 'Nathan\'s iPhone',
    password: 'rickross',
  },
  {
    ssid: 'Saul',
    password: 'wnip198!'
  }
];

WiFiControl.init({
  debug: true,
});

WiFiControl.scanForWiFi((err, res) => {
  if (err) {
    console.log(err);
  }
  prettyPrintNetworks(res.networks);
  // setupConnection(networks);
})

/**
 * Sets up connection
 * @param networks the found wifi networks
 */
function setupConnection(networks) {
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
      setTimeout(() => rotateConnections(networkCredentials, next + 1), 1000);
    });
  });
}

function prettyPrintNetworks(networks) {
  const pretty =
    networks
      .filter(({ ssid }) => {
        const ourSSIDs = networkCredentials.map(({ ssid }) => ssid);
        return (ourSSIDs.indexOf(ssid) !== -1);
      })
      .map(({ ssid, signal_level }) => {
        return {
          ssid,
          signal_level,
          timestamp: (new Date()),
        };
      });
  console.log(pretty);
}
