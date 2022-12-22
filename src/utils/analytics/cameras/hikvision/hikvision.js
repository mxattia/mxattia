#!/usr/bin/nodejs
// hikvision HTTP API Module

var 	net 		= require('net');
var  	events 		= require('events');
var 	util		= require('util');
var 	request 	= require('request');
var     bufferFrom = require('buffer-from'); 
var	    xml2js 		= require('xml2js');

//var    globalConfig = require("./config.js");
var  globalConfig = require("../../../../config.js");
const  Path = require('path')  ;
 
const  Axios = require('axios') 

const  mkdirp = require('mkdirp')
var    moment = require('moment');
var  fs = require('fs') ;
var spawn = require('child_process').spawn;
const log = require('log-to-file');

// Define Globals
var	TRACE		= false;
var	BASEURI		= false;
var	parser 		= new xml2js.Parser();

// Module Loader
var hikvision = function(options) {
	events.EventEmitter.call(this)
	this.client = this.connect(options)
	//if (options.log)	TRACE = options.log;
	BASEURI = 'http://' + options.host + ':' + options.port
	this.activeEvents	= { };
	this.triggerActive = false
    this.options=options;
    this.firstconnect=0;
};

util.inherits(hikvision, events.EventEmitter);

// Attach to camera
hikvision.prototype.connect = function(options) {
	var self = this
	var authHeader = 'Authorization: Basic ' + bufferFrom(options.user + ':' + options.pass).toString('base64');
	// Connect

	var client =  net.connect(options, function () {
		var header =	'GET /ISAPI/Event/notification/alertStream HTTP/1.1\r\n' +
				'Host: ' + options.host + ':' + options.port + '\r\n' +
				authHeader + '\r\n' + 
				'Accept: multipart/x-mixed-replace\r\n\r\n';
		client.write(header);
		client.setKeepAlive(true,1000);
        
        if (self.firstconnect==0)
        {
          handleConnection(self, options);
          self.firstconnect=1;
        }
        
        
        
        
        
		 
          
	});

	client.on('data', function(data) {
             //console.log(data.toString());
              (async () => {
                   var retalarm= await handleData(self, data);
                   if (retalarm.index!=0)
                   {
                      getSnapShot( '1200',rtspUrl(self,retalarm.index) ,retalarm.index,self);
                   }
                   
                   
                   
                   if (TRACE) console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm',retalarm);
              })();
       		 
             
	});

	client.on('close', function() {		// Try to reconnect after 30s
             if (TRACE)  console.log('close');
	            setTimeout(function() { self.connect(options) }, 60000 );
		  //handleEnd(self)
	});

	client.on('error', function(err) {
		handleError(self, err)
	});
    
     
}

// Raw PTZ Command - command/arg1/arg2/arg3/arg4
hikvision.prototype.ptzCommand = function (cmd,arg1,arg2,arg3,arg4) {
    	var self = this;
	if ((!cmd) || (isNaN(arg1)) || (isNaN(arg2)) || (isNaN(arg3)) || (isNaN(arg4))) {
		handleError(self,'INVALID PTZ COMMAND')
		return 0
	}
	request(BASEURI + '/cgi-bin/ptz.cgi?action=start&channel=0&code=' + ptzcommand + '&arg1=' + arg1 + '&arg2=' + arg2 + '&arg3=' + arg3 + '&arg4=' + arg4, function (error, response, body) {
		if ((error) || (response.statusCode !== 200) || (body.trim() !== "OK")) {
			self.emit("error", 'FAILED TO ISSUE PTZ COMMAND');
		}
	})
}

// PTZ Preset - number
hikvision.prototype.ptzPreset = function (preset) {
    	var self = this;
	if (isNaN(preset))	handleError(self,'INVALID PTZ PRESET');
	request(BASEURI + '/cgi-bin/ptz.cgi?action=start&channel=0&code=GotoPreset&arg1=0&arg2=' + preset + '&arg3=0', function (error, response, body) {
		if ((error) || (response.statusCode !== 200) || (body.trim() !== "OK")) {
			self.emit("error", 'FAILED TO ISSUE PTZ PRESET');
		}
	})
}

// PTZ Zoom - multiplier
hikvision.prototype.ptzZoom = function (multiple) {
    	var self = this;
	if (isNaN(multiple))	handleError(self,'INVALID PTZ ZOOM');
	if (multiple > 0)	cmd = 'ZoomTele';
	if (multiple < 0)	cmd = 'ZoomWide';
	if (multiple === 0)	return 0;

	request(BASEURI + '/cgi-bin/ptz.cgi?action=start&channel=0&code=' + cmd + '&arg1=0&arg2=' + multiple + '&arg3=0', function (error, response, body) {
		if ((error) || (response.statusCode !== 200) || (body.trim() !== "OK")) {
			if (TRACE) 	console.log('FAILED TO ISSUE PTZ ZOOM');
			self.emit("error", 'FAILED TO ISSUE PTZ ZOOM');
		}
	})
}

// PTZ Move - direction/action/speed
hikvision.prototype.ptzMove = function (direction,action,speed) {
    	var self = this;
	if (isNaN(speed))	handleError(self,'INVALID PTZ SPEED');
	if ((action !== 'start') || (action !== 'stop')) {
		handleError(self,'INVALID PTZ COMMAND')
		return 0
	}
	if ((direction !== 'Up') || (direction !== 'Down') || (direction !== 'Left') || (direction !== 'Right') 
	    (direction !== 'LeftUp') || (direction !== 'RightUp') || (direction !== 'LeftDown') || (direction !== 'RightDown')) {
		self.emit('error', 'INVALID PTZ DIRECTION: ' + direction)
		if (TRACE) 	console.log('INVALID PTZ DIRECTION: ' + direction);
		return 0
	}
	request(BASEURI + '/cgi-bin/ptz.cgi?action=' + action + '&channel=0&code=' + direction + '&arg1=' + speed +'&arg2=' + speed + '&arg3=0', function (error, response, body) {
		if ((error) || (response.statusCode !== 200) || (body.trim() !== "OK")) {
			self.emit("error", 'FAILED TO ISSUE PTZ UP COMMAND');
			if (TRACE) 	console.log('FAILED TO ISSUE PTZ UP COMMAND');
		}
	})
}

// Request PTZ Status
hikvision.prototype.ptzStatus = function () {
    	var self = this;
	request(BASEURI + '/cgi-bin/ptz.cgi?action=getStatus', function (error, response, body) {
		if ((!error) && (response.statusCode === 200)) {
			body = body.toString().split('\r\n').trim()
			if (TRACE) 	console.log('PTZ STATUS: ' + body);
			self.emit("ptzStatus", body);
		} else {
			self.emit("error", 'FAILED TO QUERY STATUS');
			if (TRACE) 	console.log('FAILED TO QUERY STATUS');

		}
	})
}

// Switch to Day Profile
hikvision.prototype.dayProfile = function () {
    	var self = this;
	request(BASEURI + '/cgi-bin/configManager.cgi?action=setConfig&VideoInMode[0].Config[0]=1', function (error, response, body) {
		if ((!error) && (response.statusCode === 200)) {
			if (body === 'Error') {		// Didnt work, lets try another method for older cameras
				request(BASEURI + '/cgi-bin/configManager.cgi?action=setConfig&VideoInOptions[0].NightOptions.SwitchMode=0', function (error, response, body) { 
					if ((error) || (response.statusCode !== 200)) {
						self.emit("error", 'FAILED TO CHANGE TO DAY PROFILE');
						if (TRACE) 	console.log('FAILED TO CHANGE TO DAY PROFILE');
					}
				})
			}
		} else {
			self.emit("error", 'FAILED TO CHANGE TO DAY PROFILE');
			if (TRACE) 	console.log('FAILED TO CHANGE TO DAY PROFILE');
		}	
	})
}

// Switch to Night Profile
hikvision.prototype.nightProfile = function () {
    	var self = this;
	request(BASEURI + '/cgi-bin/configManager.cgi?action=setConfig&VideoInMode[0].Config[0]=2', function (error, response, body) {
		if ((!error) && (response.statusCode === 200)) {
			if (body === 'Error') {		// Didnt work, lets try another method for older cameras
				request(BASEURI + '/cgi-bin/configManager.cgi?action=setConfig&VideoInOptions[0].NightOptions.SwitchMode=3', function (error, response, body) { 
					if ((error) || (response.statusCode !== 200)) {
						self.emit("error", 'FAILED TO CHANGE TO NIGHT PROFILE');
						if (TRACE) 	console.log('FAILED TO CHANGE TO NIGHT PROFILE');
					}
				})
			}
		} else {
			self.emit("error", 'FAILED TO CHANGE TO NIGHT PROFILE');
			if (TRACE) 	console.log('FAILED TO CHANGE TO NIGHT PROFILE');
		}	
	})
}

function getSnapShot( Width,input,channel, self) {
    
    
    var words = self.options.AnalyticsChannel.split(',');
	 
	 
    if (words.indexOf(channel.toString().trim()) ==-1){
                return ;
     }
    
    
    
    
    
    
    var host  = self.options.host.split('.').join("");
    
	var local_date=createTimeStamp() ;	
   
	var dest= globalConfig.default.recording.locationPath+'/'+ self.options.mokedccode+"/"+ host+ self.options.port+channel.toString().trim()+"/"+ local_date  ;
	if (TRACE)  console.log(dest+"/"+channel+'ffhik.jpeg');
     
    mkdirp.sync(dest) ; 
    var ms=Math.round(Date.now() / 1000);    
    
	const CommandArgs = [];
	CommandArgs.push('-err_detect');
    CommandArgs.push('ignore_err');
    CommandArgs.push('-re');
    CommandArgs.push('-y');
    CommandArgs.push('-rtsp_transport');
    CommandArgs.push('tcp');
     
	CommandArgs.push('-i');
  
      //rtsp://admin:Ma240681@213.57.112.98:1025/Streaming/Channels/402'
    console.log('snap...', input);
	CommandArgs.push( input);
    //-pix_fmt yuvj422p
    
    
    CommandArgs.push('-loglevel');
    CommandArgs.push('error');
    CommandArgs.push('-err_detect');
    CommandArgs.push('ignore_err');
    
    
    CommandArgs.push('-pix_fmt');
    CommandArgs.push('yuvj422p');
    CommandArgs.push('-r');
    CommandArgs.push('0.25');
    
    
    
    
    CommandArgs.push('-v');
    CommandArgs.push('warning');
    
    
	CommandArgs.push('-vf');
	CommandArgs.push('scale=' + Width + ':-1');
    
    
	CommandArgs.push('-vframes:v');
	CommandArgs.push('1');
    CommandArgs.push('-ss');
    CommandArgs.push('1');
    
	CommandArgs.push('-f');
	CommandArgs.push('image2');
    
	 
    CommandArgs.push(dest+"/"+channel+ms+'hik.jpeg');
    
    //ffmpeg -threads 0 -i "A_File.mp4" -ss 00:00:0.0 -t 10 -an "B_File.mp4"
    /*
    var args = [
        '-threads','0',
        '-err_detect', 'ignore_err', '-re',
        '-y', 
        '-rtsp_transport','tcp',
       
        '-i', input,
        
        '-ss', '00:00:0.0', '-t', '10' ,'-an'  
         
        ];
        */
        const args = [];
         args.push('-threads');
         args.push('0'); 
         args.push('-err_detect');  
         args.push('ignore_err');  
         args.push('-re');          
         args.push('-y'); 
         args.push('-rtsp_transport');   
         args.push('tcp'); 
         args.push('-i'); 
         args.push(input); 
         args.push('-c:v');
         args.push('libx264');
          
         args.push('-preset');
         args.push('ultrafast');
         args.push('-ss');
         args.push('00:00:0.0'); 
         args.push('-t'); 
         args.push(globalConfig.default.analytics.recordetime); 
         args.push('-an');      
               
         args.push(dest+"/"+channel+ms+'hik.mp4' );
    
    
    
    
    
    //const Process =spawn('ffmpeg', args, {stdio: 'inherit'});
    
    const Process =new spawn('ffmpeg', CommandArgs);
    
	
    
    Process.stderr.on("data", data => {
        if (TRACE) console.log(`stderr: ${data}`);
         
    });

    Process.on("error", error => {
        if (TRACE) console.log(`error: ${error.message}`);
    });

	Process.on('exit', (Code, Signal) => {
        if (TRACE)  console.log('exit..................',Code);
       
		
	});
    
    
    const Process1 =new spawn('ffmpeg', args);
    Process1.stderr.on("data", data => {
        if (TRACE)  console.log(`stderr: ${data}`);
         
    });

    Process1.on("error", error => {
        if (TRACE)  console.log(`error: ${error.message}`);
    });

	Process1.on('exit', (Code, Signal) => {
        if (TRACE)  console.log('exit..................',Code);
       
		
	});
    
    
    
    
    
    
}


 
 

/**
     * @function
     * @name generateBaseUrl
     * @param {string} user - credentials username.
     * @param {string} pass - credentials password.
     * @param {string} host - source of the camera.
     * @param {string} port - port of the camera.
     * @memberof Camera
     * @description - generate base rtsp url for the camera
     */
 function   generateBaseUrl(user, pass, host, port, protocol) {
        return protocol + "://" + user + ":" + pass + "@" + host + ":" + port + "";
    }
	
function rtspUrl(self,channel)
{
 var URL = generateBaseUrl(self.options.user, self.options.pass, self.options.host, self.options.rtspport, "rtsp") + "/Streaming/Channels/" + channel + "01";
 
 return URL;
}


async function getRequestData(self, data) {
          return new Promise((resolve, reject) => {
              
              
                 resolve('data') ;
          });

}

// Handle alarms
async  function handleData(self, data) {
    
       return new Promise((resolve, reject) => {
     
    
	    parser.parseString(data, function(err, result) {
        
		if (result && 'EventNotificationAlert' in result) {
           // if (TRACE) 	console.log('xml.... ',result);
            
            if (TRACE ) {console.log(self.options)}
           
			var code ='';	
            var action =''; 
                     
            //if (typeof result['EventNotificationAlert']=="undefined")
            //{
            //     resolve({index:0}) ;
            //}                
            

            
            if ( typeof result['EventNotificationAlert']['eventType']!== "undefined")
				{
					 code = result['EventNotificationAlert']['eventType'][0];	
				}
            if ( typeof result['EventNotificationAlert']['eventState']!== "undefined")
				{
					 action = result['EventNotificationAlert']['eventState'][0];
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
                  
               
            } 
     
			if (typeof result['EventNotificationAlert']['activePostCount'] !== "undefined") 
            {
			     count = parseInt(result['EventNotificationAlert']['activePostCount'][0])
            }
           
            /*
            if (typeof result['EventNotificationAlert']['bkgUrlxx']  !== "undefined")
				 {
                         if (TRACE)   console.log(self.options); 
					     if (TRACE)   console.log('url...',result['EventNotificationAlert']['bkgUrl'][0]);
						  var url=result['EventNotificationAlert']['bkgUrl'][0];
						 
						  var str = result['EventNotificationAlert']['bkgUrl'][0];
                          var url = str.replace(result['EventNotificationAlert']['ipAddress'], self.options.user+':'+self.options.pass+'@'+self.options.host);
						  if (TRACE)   console.log(url);
						  
					      var host  = self.options.host.split('.').join("");
						  var local_date=createTimeStamp() ;	
					      var dest= globalConfig.default.recording.locationPath+'/'+self.options.mokedccode+"/"+host+self.options.port+index.toString().trim()+"/"+ local_date  ;
			              if (TRACE)  console.log(dest);
				  
			              var fname=index.toString().trim()+'hik.jpeg';
			  
			              mkdirp.sync(dest) ;
				     
				          downloadImage (url,fname,dest);
			             
					}
                    
                    
             */
            
            
            

			// give codes returned by camera prettier and standardized description
			if (code === 'IO')            code = 'AlarmLocal';
			if (code === 'VMD')           code = 'VideoMotion';
			if (code === 'linedetection') code = 'LineDetection';
			if (code === 'videoloss')     code = 'VideoLoss';
			if (code === 'shelteralarm')  code = 'VideoBlind';
			if (action === 'active')    action = 'Start'
			if (action === 'inactive')  action = 'Stop'

			// create and event identifier for each recieved event
			// This allows multiple detection types with multiple indexes for DVR or multihead devices
			var eventIdentifier = code + index
            if (TRACE)	console.log('eventIdentifier.................',eventIdentifier);
            //self.emit("alarmtest" );
            if (index== 0 )
            {
                resolve({index:0}) ;
             //index=index+1;   
            // console.log('inside.....',rtspUrl(self,index));      
            // getSnapShot( '1200',rtspUrl(self,index) ,index,self);
            }
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
                            resolve(eventDetails) ;
                            
						}
					}
					self.activeEvents	= {};
					self.triggerActive = false

				} else {
					// should be the most common result
					// Nothing interesting happening and we haven't seen any events
					 self.emit("alarm", code,action,index);
                     resolve(eventDetails) ;
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
                resolve(eventDetails) ;
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
                            resolve(eventDetails) ;
							delete self.activeEvents[i]
                            
                            
                           
						}
					}
				}
			}
		}else{
             //console.log('user check ',result['userCheck']['statusValue'] )
             var aa=data.toString();
             if (TRACE) console.log('not result...',aa.replace(/\r\n/g, "")  );
              
             aa=aa.replace(/\n|\r/g, "");
             var posbegin=aa.search("<statusString>");
             if (posbegin>-1)
             {
                 var posend=aa.search("</statusString>");
                 if (TRACE)  console.log(posbegin,posend);
                 var length=(posend- (posbegin+"<statusString>".length) )  ;
                 var substring = aa.substr((posbegin+"<statusString>".length), length);
                 if (TRACE)  console.log(substring);
                 substring=substring.trim();
                 
                 self.emit("error", substring);
             }
            /*
             substring='<userCheck>
                <statusValue>401</statusValue>
                <statusString>Unauthorized</statusString>
                <lockStatus>unlock</lockStatus>
                <unlockTime>0</unlockTime>
                <retryLoginTime>5</retryLoginTime>
            </userCheck>'
            */
            
             
        }
         
        
        
         
	});
   
    
  } );
}

function findsubstr(str, index, length) {
  
    var substring = str.substr(index, length);
      
    console.log(substring);
}

// Handle connection
function handleConnection(self, options) {
	 	console.log('Connected to ' + options.host + ':' + options.port)
    	//self.socket = socket;
	//self.emit("connect");
    
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
	if (TRACE)  console.log('begin  save '+fname);
	response.data.pipe(writer);
	
	
})  
    .catch(error => {  
     //console.log(error);  
	 writer.end();
})  ;
}


module.exports = hikvision;
