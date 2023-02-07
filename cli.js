#!/usr/bin/env node
import minimist from 'minimist';
import fetch from 'node-fetch';
import moment from 'moment-timezone'
const args = minimist(process.argv.slice(2));
if(args.h) {
	console.log('Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE');
	console.log('    -h            Show this help message and exit.');
	console.log('    -n, -s        Latitude: N positive; S negative.');
	console.log('    -e, -w        Longitude: E positive; W negative.');
	console.log('    -z            Time zone: uses tz.guess() from moment-timezone by default.');
	console.log('    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.');
	console.log('    -j            Echo pretty JSON from open-meteo API and exit.');
} else {

var fet = 'https://api.open-meteo.com/v1/forecast/?daily=precipitation_hours&';
var lat = 0;
var lon = 0;
var timezone;

if(args.n) {
	lat = args.n;
}
if(args.s) {
	lat = -1 * args.s;
}
fet += 'latitude=' + lat;

if(args.e) {
	lon = args.e;
}
if(args.w) {
	lon = -1 * args.w;
}
fet += '&longitude=' + lon;

if(args.z) {
	timezone = args.z;
	fet += '&timezone=' + timezone;
} else {
if(args.t) {
	timezone = args.t;
	fet += '&timezone=' + timezone;
} else {
	timezone = moment.tz.guess();
	fet += '&timezone=' + timezone;
}}

if (!(lat && lon)) {
	console.log("Latitude must be in range");
	process.exit(0);
}

console.log(fet)
const response = await fetch(fet)
const data = await response.json();
if(args.j) {
        console.log(data);
} else {
if (args.d==0) {
	if (data.daily.precipitation_hours[0] > 0) {
		console.log("You might need your galoshes today");
	} else {
		console.log("You will not need your galoshes today");
	}
} else {
	if (args.d) {
		if (data.daily.precipitation_hours[args.d] > 0) {
        	        console.log("You might need your galoshes in " + args.d + " days" );
        	} else {
                	console.log("You will not need your galoshes in " + args.d + " days");
        	}       
	} else {
		if (data.daily.precipitation_hours[1] > 0) {
                	console.log("You might need your galoshes tomorrow");
        	} else {
                	console.log("You will not need your galoshes tomorrow");
        	}

	}
}
}

} 
