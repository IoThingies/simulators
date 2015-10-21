//  This script is designed to simulate a hardware device to make testing easier with iothingies
//  Parameters required:
//  -d DEVICE (the type of device to simulate)
//  -h HOSTNAME (where the endpoint of the iothingies server is hosted)
//  -p PATH (the path on the host for the endpoint to submit data to via POST)
//  -i INTERVAL (the time in seconds to wait between http POSTs
//  -v VARIABLE (the same name as the stored reading in iothingies)
//  -u UPPERBOUND (any upper bound on the random reading of the variable)
//  -l LOWERBOUND (any lower bound on the random reading of the variable)
//
//  e.g. from command line run this script:
//      node iothingies-device-sim.js -d Particle -h http://localhost:3000 -p \
//          '/api/device/123456/data' -i 5 \
//          -v temp -u 50 -l 30

var upper = 100;
var lower = 1;
var value = 0.00;

var request = require('sync-request');
var sleep = require('sleep');
var argv = require('minimist')(process.argv.slice(2));

console.log('Staring simulator...');

if (argv.d) {
    const device = argv.d;
    console.log('Device:', device);
} else {
    console.log('Need to set a device type with -d to run');
    process.exit();
}

if (argv.h) {
    const hostname = argv.h;
    console.log('Hostname:', hostname);
} else {
    console.log('Need to set a hostname (URL) with -h to run');
    process.exit();
}

if (argv.p) {
    const path = argv.p;
    console.log('Path:', path);
} else {
    console.log('Need to set a Path (route) with -p to run');
    process.exit();
}

if (argv.i) {
    const interval = argv.i;
    console.log('Interval:', interval);
} else {
    console.log('Need to set a Interval (seconds) with -i to run');
    process.exit();
}

if (argv.v) {
    const variable = argv.v;
    console.log('Variable:', variable);
} else {
    console.log('Need to set a Variable with -v to run');
    process.exit();
}

if (argv.u) {
    upper = argv.u;
    console.log('Upper:', upper);
} else {
    console.log('Setting upper limit to default of 100');
}

if (argv.l) {
    lower = argv.l;
    console.log('Lower:', lower);
} else {
    console.log('Setting lower limit to default of 1');
}

// Send out a POST request to the iothingies server  at regular inervals
while (true) {
    var data = {};
    newValue = Math.floor(newRandom() * 100) / 100;
    data.name = variable;
    data.value = newValue;
    console.log(data);
    var res = request('POST', hostname + path, { json: { "readings": [ data ] }});
    console.log(res.getBody('utf-8'));
    sleep.sleep(interval);
}

// Initialise a random number within our acceptable range OR adjust by a random small amount if set
function newRandom() {
    return value == 0 ? Math.random() * ( upper - lower ) + lower : value + ((Math.random() * 2) - 1);
}
