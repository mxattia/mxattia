/**
 * Created by Roger Hardiman <opensource@rjh.org.uk>
 *
 * Brute force scan of the network looking for ONVIF devices
 * Displays the time and date of each device
 *          the make and model
 *          the default RTSP address
 * This DOES NOT use ONVIF Discovery. This softweare tries each IP address in
 * turn which allows it to work on networks where ONVIF Discovery does not work
 * (eg on Layer 3 routed networks)
 *
  
------------------------------
Host: 37.142.115.48 Port: 90
Date: = Wed Apr 03 2019 15:00:29 GMT+0300 (Jerusalem Daylight Time)
Info: = undefined
First Live UDP Stream: =       rtsp://37.142.115.48:554/cam/realmonitor?channel=
1&subtype=0&unicast=true&proto=Onvif
First Live Multicast Stream: = rtsp://37.142.115.48:554/cam/realmonitor?channel=
1&subtype=0&unicast=false&proto=Onvif
------------------------------

 
------------------------------
Host: 37.142.115.48 Port: 90
Date: = Wed Apr 03 2019 15:01:39 GMT+0300 (Jerusalem Daylight Time)
Info: = {"manufacturer":"Dahua","model":"DHI-XVR5108HS","firmwareVersion":"3.210
.Dahua 01.8., build: 2017-03-07 (V1.1.0)","serialNumber":"3E07032PAPL0279","hard
wareId":"V1.0"}
First Live TCP Stream: =       rtsp://37.142.115.48:554/cam/realmonitor?channel=
1&subtype=0&unicast=true&proto=Onvif
First Live UDP Stream: =       rtsp://37.142.115.48:554/cam/realmonitor?channel=
1&subtype=0&unicast=true&proto=Onvif
First Live Multicast Stream: = rtsp://37.142.115.48:554/cam/realmonitor?channel=
1&subtype=0&unicast=false&proto=Onvif
 USERNAME = 'admin',
    PASSWORD = 'a1234';

------------------------------
80.178.101.179
82.80.137.98
80.179.200.98
 */
 
 
import express from 'express';
 

let onvifrouter = express.Router(); 

var IP_RANGE_START = '37.142.115.48',
    IP_RANGE_END = '37.142.115.48',
    PORT_LIST = [80,85,90,7575, 8000, 8080, 8081,8088],
    USERNAME = 'admin',
    PASSWORD = 'a1234';

var Cam = require('onvif').Cam;
var flow = require('nimble');

onvifrouter.get('/getinfo', function (req, res) {
     let ip = req.query.ip;
	
	 let username = req.query.username;
	 let password = req.query.password;

     IP_RANGE_START = ip ,
     IP_RANGE_END = ip ,
     PORT_LIST = [80,85,90,7575, 8000, 8080, 8081,8088],
     USERNAME = username ,
     PASSWORD = password ;
	 console.log('text');
	 //res.json({'onvif':IP_RANGE_START});
	  
  //res.json({'onvif...':IP_RANGE_START});
  
  /*IP_RANGE_START = '37.142.115.48',
    IP_RANGE_END = '37.142.115.48',
    PORT_LIST = [80,85,90,7575, 8000, 8080, 8081,8088],
    USERNAME = 'admin',
    PASSWORD = 'a1234';
*/




var ip_list = generate_range(IP_RANGE_START, IP_RANGE_END);
var port_list = PORT_LIST;

// hide error messages
//console.error = function() {};

// try each IP address and each Port
ip_list.forEach(function(ip_entry) {
    port_list.forEach(function(port_entry) {

        console.log(ip_entry + ' ' + port_entry);

        new Cam({
            hostname: ip_entry,
            username: USERNAME,
            password: PASSWORD,
            port: port_entry,
timeout : 5000
        }, function CamFunc(err) {
			//console.log(err);
            if (err) {
			    res.json({'onvif...': 'err'});

				return;
			}

            var cam_obj = this;

            var got_date;
            var got_info;
            var got_live_stream_tcp;
            var got_live_stream_udp;
            var got_live_stream_multicast;
            var got_recordings;
            var got_replay_stream;

            // Use Nimble to execute each ONVIF function in turn
            // This is used so we can wait on all ONVIF replies before
            // writing to the console
            flow.series([
                function(callback) {
                    cam_obj.getSystemDateAndTime(function(err, date, xml) {
                        if (!err) got_date = date;
                        callback();
                    });
                },
                function(callback) {
                    cam_obj.getDeviceInformation(function(err, info, xml) {
                        if (!err) got_info = info;
                        callback();
                    });
                },
                function(callback) {
                try {
                    cam_obj.getStreamUri({
                        protocol: 'RTSP',
                        stream: 'RTP-Unicast'
                    }, function(err, stream, xml) {
                        if (!err) got_live_stream_tcp = stream;
                        callback();
                    });
                } catch(err) {callback();}
                },
                function(callback) {
                try {
                    cam_obj.getStreamUri({
                        protocol: 'UDP',
                        stream: 'RTP-Unicast'
                    }, function(err, stream, xml) {
                        if (!err) got_live_stream_udp = stream;
                        callback();
                    });
                } catch(err) {callback();}
                },
                function(callback) {
                try {
                    cam_obj.getStreamUri({
                        protocol: 'UDP',
                        stream: 'RTP-Multicast'
                    }, function(err, stream, xml) {
                        if (!err) got_live_stream_multicast = stream;
                        callback();
                    });
                } catch(err) {callback();}
                },
                function(callback) {
                    cam_obj.getRecordings(function(err, recordings, xml) {
                        if (!err) got_recordings = recordings;
                        callback();
                    });
                },
                function(callback) {
                    // Get Recording URI for the first recording on the NVR
                    if (got_recordings) {
                        cam_obj.getReplayUri({
                            protocol: 'RTSP',
                            recordingToken: got_recordings[0].recordingToken
                        }, function(err, stream, xml) {
                            if (!err) got_replay_stream = stream;
                            callback();
                        });
                    } else {
                        callback();
                    }
                },
                function(callback) {
                    console.log('------------------------------');
                    console.log('Host: ' + ip_entry + ' Port: ' + port_entry);
                    console.log('Date: = ' + got_date);
                    console.log('Info: = ' + JSON.stringify(got_info));
                    if (got_live_stream_tcp) {
                        console.log('First Live TCP Stream: =       ' + got_live_stream_tcp.uri);
						res.json({'onvif...':got_live_stream_tcp.uri});
						
                    }
                    if (got_live_stream_udp) {
                        console.log('First Live UDP Stream: =       ' + got_live_stream_udp.uri);
                    }
                    if (got_live_stream_multicast) {
                        console.log('First Live Multicast Stream: = ' + got_live_stream_multicast.uri);
                    }
                    if (got_replay_stream) {
                        console.log('First Replay Stream: = ' + got_replay_stream.uri);
                    }
                    console.log('------------------------------');
					
                    callback();
					 
                },

            ]); // end flow

        });
    }); // foreach
}); // foreach

//export default onvifrouter;
 	  
}); 

 


function generate_range(start_ip, end_ip) {
  var start_long = toLong(start_ip);
  var end_long = toLong(end_ip);
  if (start_long > end_long) {
    var tmp=start_long;
    start_long=end_long
    end_long=tmp;
  }
  var range_array = [];
  var i;
  for (i=start_long; i<=end_long;i++) {
    range_array.push(fromLong(i));
  }
  return range_array;
}

//toLong taken from NPM package 'ip' 
function toLong(ip) {
  var ipl = 0;
  ip.split('.').forEach(function(octet) {
    ipl <<= 8;
    ipl += parseInt(octet);
  });
  return(ipl >>> 0);
};

//fromLong taken from NPM package 'ip' 
function fromLong(ipl) {
  return ((ipl >>> 24) + '.' +
      (ipl >> 16 & 255) + '.' +
      (ipl >> 8 & 255) + '.' +
      (ipl & 255) );
};




 
 
 

export default onvifrouter;



	  

 

