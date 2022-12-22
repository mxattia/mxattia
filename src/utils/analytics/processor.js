"use strict";
const net = require('net');
const log = require('node-pretty-log');

const  hikvisionipAPI = require('./cameras/hikvisionip');
//const  hikvisionAPI	= require('./cameras/nvrhikvision.js');
var  hikvisionAPI	= require('./cameras/hikvision/hikvision.js');
 
const  dahuaAPI = require('./cameras/dahua');
const  myfoscamera = require('./cameras/foscam/fos.js');
const  myprovision = require('./cameras/provision/provision.js'); 
const  mydavantis = require('./cameras/davantis/davantis.js');

const WSCLIENTX = require('ws-reconnect');
const isPortReachable = require('is-port-reachable');
// Define Globals
var	TRACE = true;
/*
var log4js = require('log4js');
 
 log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    afile: { type: 'multiFile', base: 'logs/', property: 'categoryName', extension: '.log' }
  },
  categories: {
    default: { appenders: ['out'], level: 'info' },
    tofile: { appenders: ['afile'], level: 'debug' }
  }
}); 

var logx = log4js.getLogger('tofile.xyz');
 
 
logx.info("My Debug message",' all.. ',process.argv);	
 
*/

let retryCount = 0;

 

function retryValidation() {
	if (retryCount > 5) {
		process.exit();
	}
	retryCount++;
}

function resetRetryCount() {
	retryCount = 0;
}

var myoptions=process.argv[2];
var myanalytics =process.argv[3];
if (TRACE)  console.log('myoptions....',myoptions);
if (TRACE)  console.log('myanalytics....',myanalytics);
 

var  optionsx = JSON.parse(myoptions);
if (TRACE)  console.log(optionsx.config.host);
if (TRACE)  console.log(optionsx.config.AnalyticsChannel); 
if (TRACE)  console.log(optionsx.config.port);  
if (TRACE)  console.log(optionsx.config.cameraType); 
if (TRACE)  console.log(optionsx.config.custnumber);
if (TRACE)  console.log(optionsx.config.mokedccode); 
if (TRACE)  console.log(optionsx.config.run); 
if (TRACE)  console.log(optionsx.config.channel); 
if (TRACE)  console.log(optionsx.config.username); 
if (TRACE)  console.log(optionsx.config.password); 
if (TRACE)  console.log(optionsx.config.rtspport); 

var  options={
     host: optionsx.config.host || '',
	 AnalyticsChannel: optionsx.config.AnalyticsChannel || '',
	 port: optionsx.config.port || '',
	 user: optionsx.config.username || '',
	 pass: optionsx.config.password || '',
	 cameraType:optionsx.config.cameraType || 'hikvision',
	 custnumber: optionsx.config.custnumber || '',
	 mokedccode: optionsx.config.mokedccode || '',
	 run: optionsx.config.run|| '',
     rtspport: optionsx.config.rtspport || '554',
	 log: true,
     
};
 
 
  
  
var  analyticsOptionsx = JSON.parse(myanalytics);
 


/* 
 
 
// Options:
var options = {
	host: process.argv[2] || '',
	AnalyticsChannel: process.argv[3] || '',
	port: process.argv[4] || '',
	user: process.argv[5] || '',
	pass: process.argv[6] || '',
	cameraType: process.argv[7] || 'hikvision',
	custnumber: process.argv[8] || '',
	mokedccode: process.argv[9] || '',
	run: process.argv[13] || '',
	log: true,
};

// ANALYTICS OPTIONS
var analyticsOptions = {

	host: process.argv[10] || '',
	port: process.argv[11] || 7070,
	connectionType: process.argv[12] || 'TCP',
	
};



*/

var analyticsOptions={
    
   host: analyticsOptionsx.host || '',
   port: analyticsOptionsx.port || 7070,
   connectionType: analyticsOptionsx.connectionType || 'TCP',
    
    
}

// TCP RELATED
const client = new net.Socket();

// WEBSOCKET RELATED
let wsclient;

// SHARED VARIABLES
let isConnected = false;
let camera,a ;
const cameraType = options.cameraType; // 'hikvision';
/*
var options = {
	host:  '81.218.25.50',
	port:   '80',
	user:  'admin',
	pass:   'hvi12345',
	 
};

*/
  

if (cameraType == 'hikvision') {
    console.log('hikvision.......jj............',TRACE);
	if (TRACE)  console.log('hikvision.......jj............');
	    if (options.run=='stop'){
			return ;
		}	
	       camera = new hikvisionAPI(options);
		   
}else if 	(cameraType == 'hikvisionip') {
	if (TRACE) console.log('hikvision.ip.................');
	    if (options.run=='stop'){
			return ;
		}	
	       //camera = new hikvisionipAPI(options);
           camera = new hikvisionAPI(options);          
		   
	   
} else if (cameraType == 'dahua') {
	  if (TRACE) console.log('dahua......................');
	  
	  if (options.run=='stop'){
			return ;
		}	
	  
	  
	  camera = new dahuaAPI.dahua(options);
	  
} else if (cameraType == 'ff-foscam') {
	      if (TRACE) console.log('ff-foscam...................... ' );
	       
   
		    if (options.run=='start'){
				
				
				 camera = new myfoscamera(options );
		  
		         camera.setup (options,function(cb){
	                 if (TRACE) console.log(cb);
                 }); 

				  
				
			  
			    camera.start(function(cb){
				 if (TRACE) console.log('xxxxxxxxxxxxxxxxxx'+cb);
			   });
			   
			   
			   
			   
			   
		   }
		   if (options.run=='stop'){
			     if (TRACE) console.log('xxxxxxxxxxxxxxxxxx' );
			     camera.stop( function(cb){
			     if (TRACE) console.log('xxxxxxxxxxxxxxxxxx'+cb);
			   }); 
			   return ;
		   }
          
		  
} else if (cameraType == 'ff-provision') {
	      if (TRACE) console.log('ff-provision ' );
	      camera = new myprovision(options );
           
		  
		   if (options.run=='start'){
			 camera.start(); 
		   }else{
			 camera.stop(); 
			  
		   }
	 
	  
	
} else if (cameraType == 'ff-davantis') {
	      if (TRACE) console.log('ff-davantis ' );
	      camera = new mydavantis(options );
           
		   if (options.run=='start'){
			   camera.start(); 
		   }
		   if (options.run=='stop'){
			   camera.stop(); 
		   }
		    





	
}else{
	
	return ;
}


 
camera.on( 'connect', function( cb )    {
		if (TRACE) console.log('connect from.'+options.mokedccode+' ' +cb);
		if (wsclient.isConnected){
		    wsclient.send("CAMERA_REG|" +options.mokedccode+","+ options.host + "," + options.port+","+options.custnumber);	
		    wsclient.send("TCP_CMD|"+"$"+options.custnumber+"!----!CAMON!"+"ip:" +options.host + ":" + options.port +"!*"+String.fromCharCode(13));
		 }
	})	 
	
	
camera.on( 'close', function( cb )    {
		if (TRACE) console.log('close.....processor   ' +cb); 
		
		  if (wsclient.isConnected) {
			  wsclient.send("CAMERA_OFF|" +options.mokedccode+","+ options.host + "," + options.port); 
			  wsclient.send( "TCP_CMD|"+"$"+options.custnumber+"!----!CAMOFF"+  "!" + options.host + " " + options.port  +"!*"+String.fromCharCode(13));
		}
		
	})		
		







camera.on('error', function (err) {
	
	if (TRACE) console.log('error.PROCESSOR..... '+err);
	if (cameraType == 'ff-foscam'){
		camera.stop();
	}
	
	   if (wsclient.isConnected && options.mokedccode!=undefined && options.custnumber!=undefined) {
      		 //wsclient.send("CAMERA_OFF|" +options.mokedccode+","+ options.host + "," + options.port); 
	  		// wsclient.send( "TCP_CMD|"+"$"+options.custnumber+"!----!CAMOFF"+  "!" + options.host + " " + options.port  +"!*"+String.fromCharCode(13));
	   	}
	
	
	return ;
});




// Monitor Camera Alarms
camera.on('alarm', function (code, action, index) {
  //console.log('code.....',code,action,index);
	//FaceRecognition Start 0
     if (TRACE) log('info', 'Monitor Camera Alarms', code,action, index );
	 //if (TRACE) logx.info("Monitor Camera Alarms",code,options.mokedccode,options.custnumber);	
	 
	 
	
	//if index found in AnalyticsChannel and code== VideoMotion
	//options.AnalyticsChannel
	
	
	var wcode="VMCAM"   ;
	var sarea=Number(index);
	if (code === 'VideoMotion' && action === 'Start') {wcode="CAMD,"+sarea.toString().trim()  ; if (TRACE) console.log('Video Motion Detected')};
	if (code === 'VideoMotion' && action === 'Stop')  {wcode="CAME,"+sarea.toString().trim() ;  if (TRACE) console.log('Video Motion Ended')};
	if (code === 'AlarmLocal' && action === 'Start')  {wcode="CAALT,"+sarea.toString().trim() ; if (TRACE) console.log('Local Alarm Triggered: ' + index)};
	if (code === 'AlarmLocal' && action === 'Stop')   {wcode="CAALE,"+sarea.toString().trim() ; if (TRACE) console.log('Local Alarm Ended: ' + index)};
	if (code === 'VideoLoss' && action === 'Start')   {wcode="CAVIL,"+sarea.toString().trim() ; if (TRACE) console.log('Video Lost!')};
	if (code === 'VideoLoss' && action === 'Stop')    {wcode="CAVIF,"+sarea.toString().trim() ; if (TRACE) console.log('Video Found!')};
	if (code === 'VideoBlind' && action === 'Start')  {wcode="CAVIB,"+sarea.toString().trim() ; if (TRACE) console.log('Video Blind!')};
	if (code === 'VideoBlind' && action === 'Stop')   {wcode="CAVIU,"+sarea.toString().trim() ; if (TRACE) console.log('Video Unblind!')};
	if (code === 'FaceRecognition' && action === 'Start') {wcode="CAFAD,"+sarea.toString().trim() ; if (TRACE) console.log('FaceRecognition Start 0 ')};
	if (code === 'FaceRecognition' && action === 'Stop')  {wcode="CAFAS,"+sarea.toString().trim() ; if (TRACE) console.log('FaceRecognition Stop 0 ')};
	
	//regionExiting
	if (code === 'regionExiting' && action === 'Start') {  wcode="CARXU,"+sarea.toString().trim() ; if (TRACE) console.log('regionExiting Start 0 ')};
	if (code === 'regionExiting' && action === 'Stop')  {  wcode="CARXE,"+sarea.toString().trim() ; if (TRACE) console.log('regionExiting Stop 0 ')};
	
	if (code === 'regionEntrance' && action === 'Start') {  wcode="CARGU,"+sarea.toString().trim() ; if (TRACE) console.log('regionEntrance Start 0 ')};
	if (code === 'regionEntrance' && action === 'Stop')  {  wcode="CARGE,"+sarea.toString().trim() ; if (TRACE) console.log('regionEntrance Stop 0 ')};
	
	if (code === 'fielddetection' && action === 'Start') {  wcode="CAFLU,"+sarea.toString().trim() ; if (TRACE) console.log('fielddetection Start 0 ')};
	if (code === 'fielddetection' && action === 'Stop')  {  wcode="CAFLD,"+sarea.toString().trim() ; if (TRACE) console.log('fielddetection Stop 0 ')};
	 
	if (code === 'LineDetection' && action === 'Start') {  wcode="CALNU,"+sarea.toString().trim() ; if (TRACE) console.log('LineDetection Start 0 ')};
	if (code === 'LineDetection' && action === 'Stop')  {  wcode="CALND,"+sarea.toString().trim() ; if (TRACE) console.log('LineDetection Stop 0 ')};
	 
	//davantis

    if (code === 'Person' && action === 'Start') {  wcode="PER,"+sarea.toString().trim() ; if (TRACE) console.log('   Start 0 ')};
    if (code === 'Vehicle' && action === 'Start') {  wcode="CAR,"+sarea.toString().trim() ; if (TRACE) console.log('  Start 0 ')};
	if (code === 'Other' && action === 'Start') {  wcode="OTH,"+sarea.toString().trim() ; if (TRACE) console.log('  Start 0 ')};
	if (code === 'Sabotage' && action === 'Start') {  wcode="SAB,"+sarea.toString().trim() ; if (TRACE) console.log('  Start 0 ')};
	if (code === 'Intrusion' && action === 'Start') {  wcode="INT,"+sarea.toString().trim() ; if (TRACE) console.log('  Start 0 ')};
	if (code === 'External' && action === 'Start') {  wcode="EXT,"+sarea.toString().trim() ; if (TRACE) console.log('  Start 0 ')};
	
     //DAHUA  IntelliFrame,CrossRegionDetection
    if (code === 'IntelliFrame' && action === 'Start') {  wcode="FRAST,"+sarea.toString().trim() ; if (TRACE) console.log('   Start 0 ')}; 
    if (code === 'IntelliFrame' && action === 'Pulse') {  wcode="FRAPU,"+sarea.toString().trim() ; if (TRACE) console.log('   Start 0 ')};
    if (code === 'IntelliFrame' && action === 'Stop') {  wcode="FRAOP,"+sarea.toString().trim() ; if (TRACE) console.log('   Start 0 ')};
 
    if (code === 'CrossRegionDetection' && action === 'Start') {  wcode="CARGU,"+sarea.toString().trim() ; if (TRACE) console.log('  Start 0 ')};
    if (code === 'CrossRegionDetection' && action === 'Stop') {  wcode="CARGE,"+sarea.toString().trim() ; if (TRACE) console.log('  Start 0 ')};
    if (code === 'CrossLineDetection' && action === 'Start') {  wcode="CALNU,"+sarea.toString().trim() ; if (TRACE) console.log('  Start 0 ')};
    if (code === 'CrossLineDetection' && action === 'Stop') {  wcode="CALND,"+sarea.toString().trim() ; if (TRACE) console.log('  Start 0 ')};
       
    
    /*
        VideoMotion: motion detection event
        SmartMotionHuman: human smart motion detection 
        SmartMotionVehicle：Vehicle smart motion detection
        VideoLoss: video loss detection event
        VideoBlind: video blind detection event.
        AlarmLocal: alarm detection event.
        CrossLineDetection: tripwire event
        CrossRegionDetection: intrusion event
        LeftDetection: abandoned object detection
        TakenAwayDetection: missing object detection
        VideoAbnormalDetection: scene change event
        FaceDetection: face detect event
        AudioMutation: intensity change
        AudioAnomaly: input abnormal
        VideoUnFocus: defocus detect event
        WanderDetection: loitering detection event
        RioterDetection: People Gathering event
        ParkingDetection: parking detection event
        MoveDetection: fast moving event
        StorageNotExist: storage not exist event.
        StorageFailure: storage failure event.
        StorageLowSpace: storage low space event.
        AlarmOutput: alarm output event
    */
    
    //LineDetection
	
	
	//regionEntrance,fielddetection
    //console.log('after code.....'+code+'  '+analyticsOptions.connectionType);
	// TCP
    
    
    
    
    
    
    
	
	if (action==='Stop'){
		 //return ;
	}
	
	
	var words = options.AnalyticsChannel.split(',');
	if (TRACE) console.log(words);
	//if (code === 'VideoMotion' && options.AnalyticsChannel!='xx'){
		if (words.indexOf(sarea.toString().trim()) ==-1){
			return ;
		}
		if (TRACE) console.log('found chanel.....'+words.indexOf(sarea.toString().trim()) +" ch- " +sarea.toString().trim());
		
	//}
	
	
	 if (wcode.indexOf("CAME")>-1 || wcode.indexOf("CAVIF")>-1){
	 	return ;
	 }
	
	if (analyticsOptions.connectionType == 'TCP') {
		//console.log(isConnected);
		if (isConnected) {
			 client.write("$"+options.custnumber+"!----!"+ wcode  + "!" + action + " " + index+"!*"+String.fromCharCode(13));
			//client.write("$"+analyticsOptions.host + "," + analyticsOptions.port + "," + code + "," + action + "," + index+"*"+String.fromCharCode(13));
		}
	}
	// WEBSOCKET
	if (analyticsOptions.connectionType == 'WEBSOCKET') {
		if (wsclient.isConnected) {
			//
			//wsclient.send( "TCP_CMD|"+"$"+options.custnumber+"!----!"+ wcode  + "!" +"ip:"+options.host + ":" + options.port +"-"+ action + "-" + index+"!*"+String.fromCharCode(13));
				var awcode=wcode.split(',');
			 wsclient.send( "TCP_CMD_CAM|"+"," +options.mokedccode+","+options.custnumber+","+ awcode['0']  +","+options.host + "," +  options.port +","+ action + "," + index+","+code+","+String.fromCharCode(13));
			 if (TRACE) console.log('send '+"TCP_CMD_CAM|"+","+options.mokedccode+","+options.custnumber+","+ awcode['0']  +","+options.host + "," + options.port +","+ action + "," + index+","+code+","+String.fromCharCode(13) );
			
			
			
			
		}
	}
});



if (analyticsOptions.connectionType == 'TCP') {
	// METHODS
	function initConnection() {
		if (TRACE) console.log('try connect'+analyticsOptions.port+"   "+ analyticsOptions.host);
		client.connect(analyticsOptions.port, analyticsOptions.host, function () {
			isConnected = true;
			 resetRetryCount();
		});
	}

	 initConnection();

	client.on('close', function (e) {
		
		if (TRACE) console.log('close '+e)
		retryValidation();
		isConnected = false;
		client.setTimeout(5000, function () {
			 initConnection();
		})
	});
	client.on('error', function (e) {
	  if (TRACE) console.log("error: ", e);

	});
}

if (analyticsOptions.connectionType == 'HTTP') {

}

if (analyticsOptions.connectionType == 'WEBSOCKET') {

	   wsclient = new WSCLIENTX(analyticsOptions.host + ":" + analyticsOptions.port, {
		retryCount: 3, // default is 2
		reconnectInterval: 5 // default is 5
	});
	wsclient.on("connect", function () {
		isConnected = true;
		resetRetryCount();
		if (TRACE) console.log('CONNECT .................WEBSOCKET from ' +analyticsOptions.host + ":" + analyticsOptions.port);
		// wsclient.send("CAMERA_REG|" +options.mokedccode+","+ options.host + "," + options.port+","+options.custnumber);
		 // wsclient.send("TCP_CMD|"+"$"+options.custnumber+"!----!CAMON!"+"ip:" +options.host + ":" + options.port +"!*"+String.fromCharCode(13));
	});
	wsclient.on("reconnect", function () {
		isConnected = false;
		retryValidation();
	});
	
	
	wsclient.on("close",function(){
	  if (TRACE) console.log("close..........................");
	 //  wsclient.send("TCP_CMD|"+"$"+options.custnumber+"!----!CAMOFF!"+"ip:" +options.host + ":" + options.port +"!*"+String.fromCharCode(13));
	  isConnected = false;
		retryValidation();
   });
	
	
	
	wsclient.on("destroyed",function(){
	  if (TRACE) console.log("destroyed");
	  isConnected = false;
		retryValidation();
	  
   });
	
	
	
	
	wsclient.start();
	
	

	
	
	
}