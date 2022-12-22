"use strict";
//rtsp-15-min.herokuapp.com
// add flags  21-04-2019
// delayTimeDestroyProcess if ==0  terminate not alowed

Object.defineProperty(exports, "__esModule", {
    value: true
});
var config = {
    defaultStreamTime: 600,
    delayTimeDestroyProcess: 10,
    websocketStream: {
        rate: 20,
        quality: 2

    },
	ffmpeg: {
        showOutput: false
    },
    recording: {
		externalPath: "c:/records",
        locationPath: "./records",
        enable: true,
        useFFMPEG: false, // used for saving files using ffmpeg or write the actual stream to file if useFFmpeg is false
        defaultExtension: '.flv',
        convertInProcess: false, // flag to execute the conversion in diff procees, execute the shell script or to spawn a process
        defaultOutputExtension: '.mp4',
        defaultWriteStreamExtension: '.stream',
        processStreamFiles: true,
		ffprob: false,
		timer:1440000  // 14400  before delete file recorde...1440 =24 min   60=1 min
				
    },
	 
    analytics: {
        defaultAnalyticsTime: 600,
        recordetime:10,
        trace:true
        
    },
    api: {
        baseAPI: '/api'
    },
	 chkpermition:{
		 url:'192.168.1.106' //  '192.168.1.106' //  'www.attiatech.net'
		
	},
	
	
	
	
    host: '127.0.0.1',   //change to 127.0.0.1  rtsp-15-min.herokuapp.com
    port: 9898               //5000 /80
	
};

exports.default = config;