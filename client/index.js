const WiFiControl = require( 'wifi-control');
const request = require('request');
const _find = require('lodash/find');
const serverUri = '10.251.82.83';
const serverPort = 3000;
const endpoint = `http://${serverUri}:${serverPort}`;

WiFiControl.init({
  debug: true,
});

const beacons = [
  {
    name: 'Saul',
    location: [0, 0],
  },
  {
    name: 'Nathan\'s iPhone',
    location: [0, 3],
  },
  {
    name: 'H Wildermuth',
    location: [3, 0],
  },
];

searchForWifi();

/**
 * Searches for Wifi
 */
function searchForWifi() {
  setInterval(() => {
    WiFiControl.scanForWiFi((err, res) => {
      if (err) {
        console.log(err);
      }
      prepareDataForServer(res.networks);
    })
  }, 1000);
}

/**
 * Pretty prints the found networks
 * @param networks an array of found networks
 */
function prepareDataForServer(networks) {
  const ssidWhitelist = beacons.map(({ name }) => name);
  const foundWhitelistedNetworks = [];
  const pretty =
    networks
      .filter(({ ssid }) => {
        // Check whether SSID is in whitelist
        // (i.e. name of one of the beacons)
        return (ssidWhitelist.indexOf(ssid) !== -1);
      })
      .map(({ ssid, signal_level }) => {
        foundWhitelistedNetworks.push(ssid);
        return {
          ssid,
          signal_level,
          timestamp: (new Date()),
          location: _find(beacons, ['name', ssid]).location,
        };
      });
  console.log(`Found networks: ${foundWhitelistedNetworks}`);
  sendDataToServer(pretty);
}

function sendDataToServer(data) {
  request.post(`${endpoint}/api/data`, {
    form: {
      data,
    },
  }, (err, response, body) => {
    if (err) {
      if (err.code === 'ECONNREFUSED') {
        return console.error(`It appears that the server at ${endpoint} is not running.`);
      }
      return console.error(err);
    }
    return console.log('Response from server: ' + body);
  });
}
