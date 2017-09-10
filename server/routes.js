const _get = require('lodash/get');
const path = require('path');
const { spawn } = require('child_process');

function routes(io) {
  function pythonController(req, res) {
    // Use lodash so no error is thrown if req.body is undefined
    const data = JSON.stringify(_get(req, 'body.data', []));
    //console.log(data);
    const python = spawn('python', [path.join(__dirname, 'regress.py')]);
    let output = '';
    let pythonError = false;
    python.stderr.on('data', (data) => {
      pythonError = true;
      console.error(`Error: ${data}`);
    });
    python.stdout.on('data', (data) => {
      output += data.toString();
    });
    python.stdout.on('end', () => {
      res.end('Data received.');
      if (!pythonError) {
        try {
          const processedData = processOutput(output);
          io.sockets.emit('data', {
            data: processedData,
          });
        } catch (err) {
          console.error(
            'Error: Data was not able to be processed. ' +
            'Perhaps you don\'t have 3 phones connected?'
          );
          console.log(err);
        }
      } else {
        console.log('An error occurred within Python');
      }
    });
    python.stdin.write(data);
    python.stdin.end();
  }

  function processOutput(output) {
    /**
     * stdout is:
     * [xpos,ypos] (meters), "Saul": [locX, locY], radius, "H Wildermuth": loc, radius, "Nathan\'s iPhone": loc, radius
     * mock data:
     * [2.1, 1.1] [0, 3] 5 [0, 0] 2 [3, 0] 7
     */
    const normalized = output.replace(/ /g, '');
    // Bracketed groups hold positions
    // We don't use normalized so we can work with
    // the space-delimited first bracket group
    const bracketedGroups = output.match(/\[.*?\]/g).map((group, i) => {
      // First group is special, need to renormalize to normal array format
      if (i === 0) {
        return JSON.stringify(group.replace(/\[\]/g, '').split(' ').join(','));
      }
      // Remove spaces for all groups other than first
      return group.replace(/ /g, '');
    });
    // Digits after brackets hold radii - substring to remove leading bracket
    const digitsAfterBrackets = normalized.match(/\]\d/g).map((m) => m.substring(1));
    // JSON parse to create native array
    const clientPosition = JSON.parse(bracketedGroups[0]);
    const beaconData = [];
    // Iterate over 3 beacons
    for (let i = 0; i < 3; i++) {
      beaconData[i] = {
        // offset by 1 b/c first bracket group is client position
        // JSON parse to turn it into a native array
        position: JSON.parse(bracketedGroups[i + 1]),
        radius: digitsAfterBrackets[i],
      };
    }
    return {
      clientPosition,
      beaconData,
    };
  }

  return {
    pythonController,
  };
}

module.exports = routes;
