const WiFiControl = require( 'wifi-control');
const request = require('request');
const serverUri = '10.251.82.83';
const serverPort = 3000;

WiFiControl.init({
  debug: true,
});

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
  const ssidWhitelist = ['Saul', 'Nathan\'s iPhone', 'H Wildermuth'];
  const pretty =
    networks
      .filter(({ ssid }) => {
        // Check whether SSID is in whitelist
        // (i.e. name of one of the beacons)
        return (ssidWhitelist.indexOf(ssid) !== -1);
      })
      .map(({ ssid, signal_level }) => {
        return {
          ssid,
          signal_level,
          timestamp: (new Date()),
        };
      });
  sendDataToServer(pretty);
}

function sendDataToServer(data) {
  request.post(`http://${serverUri}:${serverPort}/api/data`, {
    form: {
      data,
    },
  }, (err, response, body) => {
    if (err) {
      console.log(err);
    }
    console.log(body);
  });
}
