#!/usr/bin/nodejs
// hikvision HTTP API Module

/*
Info: = {"manufacturer":"Hangzhou Hikvision Digital Technology Co., Ltd","model"
:"DS-9664NI-I8","firmwareVersion":"V4.1.64, build 190216","serialNumber":"162018
0821CCRRC44818136WCVU","hardwareId":255}
First Live TCP Stream: =       rtsp://213.57.112.98:1025/Streaming/Unicast/channel
s/101
First Live UDP Stream: =       rtsp://10.10.20.50:1025/Streaming/Unicast/channel
s/101
First Live Multicast Stream: = rtsp://10.10.20.50:1025/Streaming/Multicast/chann
els/101
{ '$':
      { version: '1.0',
        xmlns: 'http://www.hikvision.com/ver20/XMLSchema' },
     ipAddress: [ '10.10.20.50' ],
     portNo: [ '91' ],
     protocol: [ 'HTTP' ],
     macAddress: [ '58:03:fb:c6:b7:80' ],
     dynChannelID: [ '9' ],
     dateTime: [ '2020-09-15T09:20:02+02:00' ],
     activePostCount: [ '107' ],
     eventType: [ 'fielddetection' ],
     eventState: [ 'active' ],
     eventDescription: [ 'fielddetection alarm' ],
     DetectionRegionEntry: [ [Object] ],
     detectionPictureTransType: [ 'url' ],
     detectionPicturesNumber: [ '1' ],
     bkgUrl:
      [ 'http://10.10.20.50:91/picture/Streaming/tracks/903/?name=ch0009_03000000175010982758400157264&size=157264' ],
     URLCertificationType: [ 'digest' ] } }

*/

var  globalConfig = require("../../../config.js");

const Path = require('path')  ;
const Axios = require('axios');	
const mkdirp = require('mkdirp')
var   moment = require('moment');


var net = require('net');
var events = require('events');
var util = require('util');
var request = require('request');
var	xml2js = require('xml2js');
 var  fs = require('fs') ;

// Define Globals
var	TRACE = true;
var	BASEURI = true;
var	parser = new xml2js.Parser();
var bufferFrom = require('buffer-from');

 

/* ============================================================
  Function: Download Image
============================================================ */ 
async function downloadImagexx (url,fname,dest) {  
  console.log('url...............................',url); 
  const path =  Path.resolve( dest, '', fname)
  const writer = fs.createWriteStream(path)

  const response = await Axios({
    url,
      timeout: 60 * 4 * 1000, // Let's say you want to wait at least 4 mins
    method: 'GET',
	withCredentials: true,
    responseType: 'stream'
  }).then(   response => {  
// Saving file to working directory  
    //response.data.pipe(fs.createWriteStream("todays_picture.jpeg"));  
	console.log('save '+fname);
	response.data.pipe(writer);
})  
    .catch(error => {  
    //console.log(error);  
});  
  
 
}


async function downloadImage (url,fname,dest) {  
  //console.log('url...............................',url); 
  const path =  Path.resolve( dest, '', fname);
  const writer = fs.createWriteStream(path);
  
  writer.on('error', function(err) {
    //console.log(err);
    writer.end();
	return ;
});

  const response = await Axios({
    url,
      timeout: 60 * 4 * 1000, // Let's say you want to wait at least 4 mins
    method: 'GET',
	withCredentials: true,
    responseType: 'stream'
  }).then(   response => {  
// Saving file to working directory  
    //response.data.pipe(fs.createWriteStream("todays_picture.jpeg"));  
	console.log('begin  save '+fname);
	response.data.pipe(writer);
	
	
})  
    .catch(error => {  
     //console.log(error);  
	 writer.end();
})  ;
}

function createTimeStamp(){
	var d = new Date();
        var month = d.getMonth() + 1;
        if (month < 10) { month = "0" + month; }
        var day = d.getDate();
        if (day < 10) { day = "0" + day; }
        var hours = d.getHours();
        if (hours < 10) { hours = "0" + hours; }
        var minutes = d.getMinutes();
        if (minutes < 10) { minutes = "0" + minutes; }
        var dateCreated = d.getFullYear() + "" + (month) + "" + day + "" + hours + "" + minutes;
        return dateCreated;
	
}	


function trim(str) { 
      
    // Use trim() function 
    var trimContent = str ; 
      
    console.log( trimContent.toString()); 
} 
// Module Loader
var hikvision = function(options) {
	events.EventEmitter.call(this)
	this.client = this.connect(options);
    console.log('options.log......................................',options); 
	 if (options.log) 
	 {
	 	TRACE = options.log;
     }
	BASEURI = 'http://' + options.host + ':' + options.port ;
	this.activeEvents = { };
	this.triggerActive = false
};




  
util.inherits(hikvision, events.EventEmitter);

// Attach to camera
hikvision.prototype.connect = function(options) {
	var self = this;
	var authHeader = 'Authorization: Basic ' +  bufferFrom(options.user + ':' + options.pass).toString('base64'); 
    //var authHeader = 'Authorization: Basic ' + new Buffer(options.user + ':' + options.pass).toString('base64');
	// Connect
	var client = net.connect(options, () => {
		var header = 'GET /ISAPI/Event/notification/alertStream HTTP/1.1\r\n' +
		'Host: ' + options.host + ':' + options.port + '\r\n' +
		authHeader + '\r\n' + 
		'Accept: multipart/x-mixed-replace\r\n\r\n';
		client.write(header);
		 client.setKeepAlive(true, 1000);
		console.log('connect....', 'hik ip connect');
		handleConnection(this, options);
	});

	client.on('data', (data) => {
		
		// Function call 
         //trim(data); 
         
         /*
         buffers.from analytics file xy data##########......................
HTTP/1.1 401 Unauthorized
Date: Wed, 30 Nov 2022 20:09:15 GMT
Server: Webs
X-Frame-Options: SAMEORIGIN
Cache-Control: no-cache
Content-Length: 231
Content-Type: application/xml; charset="UTF-8"
Connection: keep-alive
Keep-Alive: timeout=60, max=99
WWW-Authenticate: Digest realm="c504892f438ee5f2114e9fdd", domain="::", qop="auth", nonce="158ca9b5cb4b32a578432756aef2a189:1669838955551", opaque="", algorithm="MD5", stale="FALSE"
WWW-Authenticate: Basic realm="c504892f438ee5f2114e9fdd"

<?xml version="1.0" encoding="UTF-8" ?>
<userCheck>
<statusValue>401</statusValue>
<statusString>Unauthorized</statusString>
<lockStatus>lock</lockStatus>
<unlockTime>210</unlockTime>
<retryLoginTime>0</retryLoginTime>
</userCheck>

analytics  Unauthorized
Warning: 2022-11-30 08:09:15 Terminating process =>............ 14723523324681analytics
buffers.from analytics file xy Connection error: Unauthorized
error.PROCESSOR..... Unauthorized
analytics  Unauthorized
Warning: 2022-11-30 08:09:15 Terminating process =>............ 14723523324681analytics
Warning: 2022-11-30 08:09:15 Terminating process =>............ 14723523324681analytics
Warning: 2022-11-30 08:09:15 Terminating process =>............ 14723523324681analytics
         
         
         */
		    console.log('data##########......................',data.toString());
            
            if (data.toString().indexOf("Unauthorized") > -1) {
                
                handleError(this, "Unauthorized");
                return ;
            }
                
            
            
	   
		    parser.parseString(data, function(err, result) {
			console.log('result##########......................',result);
			if (result==undefined){
				console.log('result..............',result);
				return ;
			}else{
				console.log('result',result);
			
			}
				
			if (result) {
				
				
				/*
				
				{ EventNotificationAlert:
				   { '$':
					  { version: '1.0',
						xmlns: 'http://www.hikvision.com/ver20/XMLSchema' },
					 ipAddress: [ '10.10.20.50' ],
					 portNo: [ '91' ],
					 protocol: [ 'HTTP' ],
					 macAddress: [ '58:03:fb:c6:b7:80' ],
					 dynChannelID: [ '5' ],
					 dateTime: [ '2020-01-23T14:52:14+02:00' ],
					 activePostCount: [ '219' ],
					 eventType: [ 'VMD' ],
					 eventState: [ 'active' ],
					 eventDescription: [ 'Motion alarm' ] } }
								
				*/
				/*
				
				  { EventNotificationAlert:
					   { '$':
						  { version: '1.0',
							xmlns: 'http://www.hikvision.com/ver20/XMLSchema' },
						 ipAddress: [ '192.168.1.150' ],
						 portNo: [ '88' ],
						 protocol: [ 'HTTP' ],
						 macAddress: [ '44:47:cc:d0:89:c6' ],
						 channelID: [ '0' ],
						 dateTime: [ '2020-11-27T15:22:30+02:00' ],
						 activePostCount: [ '0' ],
						 eventType: [ 'videoloss' ],
						 eventState: [ 'inactive' ],
						 eventDescription: [ 'videoloss alarm' ] } }
									
				*/
				
				
				
				try {
					
					
					if ( typeof result['EventNotificationAlert']== "undefined"){
						console.log('result..............',result);
						 //return ;
					}
					
					
				    var code = ''; //result['EventNotificationAlert']['eventType'][0];
				    var action ='';// result['EventNotificationAlert']['eventState'][0];
					if ( typeof result['EventNotificationAlert']['eventType']!== "undefined")
					{
					    var code = result['EventNotificationAlert']['eventType'][0];	
					}
					
					if ( typeof result['EventNotificationAlert']['eventState']!== "undefined")
					{
						 var action = result['EventNotificationAlert']['eventState'][0];
					}
					
					//channelID
						var index=0;
						var count =0;
					 if ( typeof result['EventNotificationAlert']['channelID']!== "undefined")
						 {
							 if (  result['EventNotificationAlert']['channelID'][0]== '')
							 {
							    index=0;
							 }else{
								 index = parseInt(result['EventNotificationAlert']['channelID'][0]); 
							 }
							 
						 } 
					
					
					
					
					
					if (typeof result['EventNotificationAlert']['dynChannelID'] !== "undefined")
					{	
				         if (result['EventNotificationAlert']['dynChannelID'][0]=='')
						 {
							 index=0;
						 }else{
				             index = parseInt(result['EventNotificationAlert']['dynChannelID'][0])
						 }
				         count = parseInt(result['EventNotificationAlert']['activePostCount'][0])
					   
					}
					  
					 
					 console.log('motion...'+code);
					 if (typeof result['EventNotificationAlert']['bkgUrl']  !== "undefined")
					 {
					     console.log('url...',result['EventNotificationAlert']['bkgUrl'][0]);
						 //var url=result['EventNotificationAlert']['bkgUrl'][0];
						 
						 ///var str = result['EventNotificationAlert']['bkgUrl'][0];
                         ///var url = str.replace(result['EventNotificationAlert']['ipAddress'], options.user+':'+options.pass+'@'+options.host);
						 
						 
						 
						 //var url='http://admin:Ma240681@213.57.112.98:91/picture/Streaming/tracks/903/?name=ch0009_03000000175020210995200169154&size=169154';
					     ///var host  = options.host.split('.').join("");
						 ///var local_date=createTimeStamp() ;	
					     ///var dest= globalConfig.default.recording.locationPath+'/'+options.mokedccode+"/"+host+options.port+index.toString().trim()+"/"+ local_date  ;
			             ///console.log(dest);
				  
			             ///var fname=index.toString().trim()+'hik.jpeg';
			  
			              ///mkdirp.sync(dest) ;
				     
				         ///downloadImage (url,fname,dest);
			        
					 }
					 
					 
					 
					  
					 
					 

				}
				catch (e) {
				 // console.log("entering catch block");
				 console.log(e);
				  console.log("leaving catch block");
				  return ;
				}
								
				
				
				
				
				// give codes returned by camera prettier and standardized description
				if (code === 'IO')            code = 'AlarmLocal';
				if (code === 'VMD')           code = 'VideoMotion';
				if (code === 'linedetection') code = 'LineDetection';
				if (code === 'videoloss')     code = 'VideoLoss';
				if (code === 'shelteralarm')  code = 'VideoBlind';
				if (action === 'active')      action = 'Start';
				if (action === 'inactive')    action = 'Stop';

				// create and event identifier for each recieved event
				// This allows multiple detection types with multiple indexes for DVR or multihead devices
				var eventIdentifier = code+'-' + index
                 if (TRACE)	console.log('Ending Event: '+eventIdentifier);
				// Count 0 seems to indicate everything is fine and nothing is wrong, used as a heartbeat
				// if triggerActive is true, lets step through the activeEvents
				// If activeEvents has something, lets end those events and clear activeEvents and reset triggerActive
				if (count == 0) {
					if (self.triggerActive == true) {
						for(var i in self.activeEvents) {
							if(self.activeEvents.hasOwnProperty(i)){
								var eventDetails = self.activeEvents[i]
								if (TRACE)	console.log('Ending Event: ' + i + ' - ' + eventDetails["code"] + ' - ' + ((Date.now() - eventDetails["lasttimestamp"])/1000));
								self.emit("alarm", eventDetails["code"],'Stop', eventDetails["index"]);
							}
						}
						self.activeEvents	= {};
						self.triggerActive = false

					} else {
						// should be the most common result
						// Nothing interesting happening and we haven't seen any events
							self.emit("alarm", code,action,index);
					}
				}

				// if the first instance of an eventIdentifier, lets emit it, 
				// add to activeEvents and set triggerActive
				else if (typeof self.activeEvents[eventIdentifier] == 'undefined' || self.activeEvents[eventIdentifier] == null){
					var eventDetails = { }
					eventDetails["code"] = code
					eventDetails["index"] = index
					eventDetails["lasttimestamp"] = Date.now();

					self.activeEvents[eventIdentifier] = eventDetails
					self.emit("alarm", code,action,index);
					self.triggerActive = true

				// known active events
			} else {
				if (TRACE)	console.log('    Skipped Event: ' + code + ' ' + action + ' ' + index + ' ' + count );

					// Update lasttimestamp
					var eventDetails = { }
					eventDetails["code"] = code
					eventDetails["index"] = index
					eventDetails["lasttimestamp"] = Date.now();
					self.activeEvents[eventIdentifier] = eventDetails

					// step through activeEvents
					// if we haven't seen it in more than 2 seconds, lets end it and remove from activeEvents
					for(var i in self.activeEvents) {
						if(self.activeEvents.hasOwnProperty(i)){
							var eventDetails = self.activeEvents[i]
							if (((Date.now() - eventDetails["lasttimestamp"])/1000) > 2) {
								if (TRACE)	console.log('    Ending Event: ' + i + ' - ' + eventDetails["code"] + ' - ' + ((Date.now() - eventDetails["lasttimestamp"])/1000));
								self.emit("alarm", eventDetails["code"],'Stop', eventDetails["index"]);
								delete self.activeEvents[i]
							}
						}
					}
				}
			}
		});
	});

	client.on('closex', () => {// Try to reconnect after 30s
        console.log('close hik client#####');
		setTimeout(()=>{
			this.connect(options);
		}, 30000);
		//handleEnd(this);
	});

	client.on('error', (err) => {
		handleError(this, err);
	});
}

// Raw PTZ Command - command/arg1/arg2/arg3/arg4
hikvision.prototype.ptzCommand = (cmd) => {
	var args = arguments.slice(1, arguments.length);

	if ((!cmd) || arguments.some((arg) => isNaN(arg))) {
		handleError(this,'INVALID PTZ COMMAND')

		return 0;
	}

	request(BASEURI + '/cgi-bin/ptz.cgi?action=start&channel=0&code=' + ptzcommand 
		+ args.map((val, i) => '&arg' + (i + 1) + '=' + val)
		, function (error, response, body) {
		if ((error) || (response.statusCode !== 200) || (body.trim() !== "OK")) {
			this.emit("error", 'FAILED TO ISSUE PTZ COMMAND');
		}
	})
}

// PTZ Preset - number
hikvision.prototype.ptzPreset = (preset) => {
	if (isNaN(preset))	handleError(this,'INVALID PTZ PRESET');
	request(BASEURI + '/cgi-bin/ptz.cgi?action=start&channel=0&code=GotoPreset&arg1=0&arg2=' + preset + '&arg3=0', function (error, response, body) {
		if ((error) || (response.statusCode !== 200) || (body.trim() !== "OK")) {
			this.emit("error", 'FAILED TO ISSUE PTZ PRESET');
		}
	})
}

// PTZ Zoom - multiplier
hikvision.prototype.ptzZoom = (multiple) => {
	if (isNaN(multiple))
		handleError(this, 'INVALID PTZ ZOOM');

	if (multiple > 0) 
		cmd = 'ZoomTele';
	if (multiple < 0)
		cmd = 'ZoomWide';
	if (multiple === 0)
		return 0;

	var data = {
		action: 'start',
		channel: 0,
		code: cmd,
		arg1: 0,
		arg2: multiple,
		arg3: 0,
	};

	request(BASEURI + '/cgi-bin/ptz.cgi?' + Object.keys(data).map(k=>k+'='+data[k]).join('&'), function (error, response, body) {
		if ((error) || (response.statusCode !== 200) || (body.trim() !== "OK")) {
			if (TRACE) 	console.log('FAILED TO ISSUE PTZ ZOOM');
			this.emit("error", 'FAILED TO ISSUE PTZ ZOOM');
		}
	})
}

// PTZ Move - direction/action/speed
hikvision.prototype.ptzMove = (direction,action,speed) => {
	if (isNaN(speed))	handleError(this,'INVALID PTZ SPEED');
	if (!['start', 'stop'].includes(action)) {
		handleError(this,'INVALID PTZ COMMAND')
		return 0;
	}
	if (!['Up', 'Down', 'Left', 'Right', 'LeftUp', 'RightUp', 'LeftDown', 'RightDown'].includes(direction)) {
		this.emit('error', 'INVALID PTZ DIRECTION: ' + direction)
		if (TRACE) 	console.log('INVALID PTZ DIRECTION: ' + direction);
		return 0;
	}

	var data = {
		action: action,
		channel: 0,
		code: direction,
		arg1: speed,
		arg2: speed,
		arg3: 0
	};

	request(BASEURI + '/cgi-bin/ptz.cgi?' + Object.keys(data).map(k=>k+'='+data[k]).join('&'), function (error, response, body) {
		if (error || response.statusCode !== 200 || body.trim() !== "OK") {
			this.emit("error", 'FAILED TO ISSUE PTZ UP COMMAND');
			if (TRACE) 	console.log('FAILED TO ISSUE PTZ UP COMMAND');
		}
	})
}

// Request PTZ Status
hikvision.prototype.ptzStatus = () => {
	request(BASEURI + '/cgi-bin/ptz.cgi?action=getStatus', function (error, response, body) {
		if ((!error) && (response.statusCode === 200)) {
			body = body.toString().split('\r\n').trim()
			if (TRACE) 	console.log('PTZ STATUS: ' + body);
			this.emit("ptzStatus", body);
		} else {
			this.emit("error", 'FAILED TO QUERY STATUS');
			if (TRACE) 	console.log('FAILED TO QUERY STATUS');

		}
	})
}

// Switch to Day Profile
hikvision.prototype.dayProfile = () => {
	request(BASEURI + '/cgi-bin/configManager.cgi?action=setConfig&VideoInMode[0].Config[0]=1', function (error, response, body) {
		if ((!error) && (response.statusCode === 200)) {
			if (body === 'Error') {		// Didnt work, lets try another method for older cameras
				request(BASEURI + '/cgi-bin/configManager.cgi?action=setConfig&VideoInOptions[0].NightOptions.SwitchMode=0', function (error, response, body) { 
					if ((error) || (response.statusCode !== 200)) {
						this.emit("error", 'FAILED TO CHANGE TO DAY PROFILE');
						if (TRACE) 	console.log('FAILED TO CHANGE TO DAY PROFILE');
					}
				})
			}
		} else {
			this.emit("error", 'FAILED TO CHANGE TO DAY PROFILE');
			if (TRACE) 	console.log('FAILED TO CHANGE TO DAY PROFILE');
		}	
	})
}

// Switch to Night Profile
hikvision.prototype.nightProfile = () => {
	request(BASEURI + '/cgi-bin/configManager.cgi?action=setConfig&VideoInMode[0].Config[0]=2', function (error, response, body) {
		if ((!error) && (response.statusCode === 200)) {
			if (body === 'Error') {		// Didnt work, lets try another method for older cameras
				request(BASEURI + '/cgi-bin/configManager.cgi?action=setConfig&VideoInOptions[0].NightOptions.SwitchMode=3', function (error, response, body) { 
					if ((error) || (response.statusCode !== 200)) {
						this.emit("error", 'FAILED TO CHANGE TO NIGHT PROFILE');
						if (TRACE) 	console.log('FAILED TO CHANGE TO NIGHT PROFILE');
					}
				})
			}
		} else {
			this.emit("error", 'FAILED TO CHANGE TO NIGHT PROFILE');
			if (TRACE) 	console.log('FAILED TO CHANGE TO NIGHT PROFILE');
		}	
	})
}

// Handle connection
function handleConnection(self, options) {
		console.log('Connected to ' + options.host + ':' + options.port);
    	//self.socket = socket;
    // self.emit("connect",'ok');
	 setTimeout(function(){
	 	console.log('send connect...')
	 	self.emit("connect",'ok');
	 	},3000);
	 
	
	
	
	
}

// Handle connection ended
function handleEnd(self) {
	if (TRACE)	console.log("Connection closed!");
	self.emit("end");
}

// Handle Errors
function handleError(self, err) {
	if (TRACE)	console.log("Connection error: " + err);
	self.emit("error", err);
}

// Prototype to see if string starts with string
String.prototype.startsWith = function (str){
	return this.slice(0, str.length) == str;
};
module.exports = hikvision;
 