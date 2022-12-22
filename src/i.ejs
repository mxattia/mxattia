/*
http://localhost:9898/api/getRecordsByCustomer?customer=2122032
http://localhost:5000/api/getRecords
http://localhost:9898/records/2122032/941591402035541/201810281628/941591402035542.flv
https://rtsp-recording.herokuapp.com/records/90000/81218150605543/201903281247/81218150605543.flv

27-11-2022  ffmpegx(fileLocation+'.stream').seekInput(0.200).format('gif')  
*/
 
 
const dns = require('dns');



  

var request = require('request');

var rp = require('request-promise');

var express = require('express')

// Import the library:
var cors = require('cors');


var app = express();

// Then use it before your routes are set up:
app.use(cors());











var server = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(server);
import  Streams  from './models/streams';
import Camera from './models/camera';
import Utils from './utils';
import config from './config';
const log = require('node-pretty-log');
const mkdirp = require("mkdirp");
//import routes from "./routes";
import onvifroutes from "./onvif";
var findRemoveSync = require('find-remove');
import fs from 'fs';
import { recordsHandler } from './middlewares';
var ffmpegx = require('fluent-ffmpeg');
 
 
const isPortReachable = require('is-port-reachable');
var fsf = require('fs');
    var path = require('path');


/** LOGS Options **/
/*
log('error', 'Uh Oh...', error);
log('warn', 'Warning...', warning);
log('info', 'Info...', info);
log('success', 'Success...', success);
*/
function noOp() { };
//const StreamsManager = new Streams();
const StreamsManager = new _streams2.default();



log('info', 'Starting Express Web Server on Port ' + _config2.default.port);
//start webserver
var PORT = process.env.PORT || _config2.default.port;

server.listen(PORT);

//log('info', 'Starting Express Web Server on Port ' + config.port);
//start webserver
//server.listen(config.port);
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
    extended: true
}));
//make libraries static
// app.use('/libs', express.static(__dirname + '/../../web/libs'));
app.use('/examples', express.static(__dirname + '/examples'));
app.use('/lib', express.static(__dirname + '/lib'));
require('./routes').default(app);
app.use('/records', recordsHandler, express.static(__dirname + './../records')); 
 
 
  
 
//app.use('/api', routes);
//homepage with video element.
//static file send of index.html

app.use('/api', onvifroutes);


 // apply headers
app.use((req, res, next) => {
	  console.log('use app................');
	  
	
	
	
	
	  console.log('Access-Control-Allow-METHODS');
        if(process.env.NODE_ENV == "development"){
            //res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            //res.header('Expires', '-1');
            //res.header('Pragma', 'no-cache');
        }
		
		 
		
		
        //res.header('Access-Control-Allow-METHODS', 'GET,PUT,POST,DELETE,HEAD,OPTIONS');
		res.header('Access-Control-Allow-METHODS', 'GET,PUT,POST,DELETE,HEAD');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', "X-ACCESS_TOKEN, Access-Control-Allow-Origin, Authorization, Origin, x-requested-with, Content-Type, Content-Range, Content-Disposition, Content-Description");
        next();
});

 
 
 app.post('/permition', function (req, res) {
	
                   console.log('Remote Address...... '+req.connection.remoteAddress);
		 
							
	             	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
					if (ip.substr(0, 7) == "::ffff:") {
					  ip = ip.substr(7)
					}
		             console.log("client IP is *********************" + ip );
		
		           //{"root_name":{"id":"0","clientip":"0","allowed":"0","showcamera":"0","analytics":"0","remark":"","ndatetime":""}}
		
  
                    var url = 'http://127.0.0.1/chkpermition/connect.php?ip='+ip;
        
                    var yesno='FAILL';
				  // this is a get, so there's no post data
                    //var url = 'http://www.attiatech.net/chkpermition/connect.php?ip='+ip;
				    rp(url)
                    .then   (function (htmlString) {
						console.log('json..'+htmlString  );
						const obj = JSON.parse(htmlString);
						console.log('rp permition  ANSWER FROM ATTIATECH..'+ obj.root_name.id);
                        // Process html...
						if (obj.root_name.allowed=='1' && obj.root_name.showcamera=='1' ){
							yesno='OK'; 
						}else{
							yesno='FAILL';
						}
						
						 
						
						res.json({ status: yesno  });
						 
						
                  })
                   .catch(function (err) {
                       // Crawling failed...
					    console.log('rp ANSWER FROM ATTIATECH..'+err );
					    res.json({ status: yesno  }); 
					     
                  });
							
	
   
   
   
});


app.get('/', function (req, res) {
	
            console.log('Remote Address...... '+req.connection.remoteAddress);
         
			res.sendFile(__dirname + '/index.html');
		
            
      });  
 
	
  // res.sendFile(__dirname + '/index.html');
   
   


app.get('/status', function (req, res) {
    res.json(JSON.stringify(StreamsManager.Emitters));
});
let createFileSystem = function (req, res, next) {
    try {
        if (StreamsManager.isFeedExist(req.CameraInstance.getFeedId())) {
            log('warn', "Create File System => Camera feed exists: " + req.CameraInstance.getFeedId());
            next();
            return;
        }
        log('warn', "Create File System =>  Camera feed not exists: " + req.CameraInstance.getFeedId());
        log('success','getcusternumber...'+req.CameraInstance.getcustnumber()) 
		console.log('get channel recorde .............'+req.CameraInstance.getchanel());
        let loc = config.recording.locationPath + "/"+req.CameraInstance.getcustnumber()+"/";
        if (config.recording.enable && req.CameraInstance.getchanel()!='0') {
            loc +=  req.CameraInstance.getFeedId() + "/" + Utils.createTimeStamp() + "/";
            console.log('success',loc);
			
			
			//if (!fs.existsSync(loc)){
			//	fs.mkdirSync(loc,'0777', true);
				
			//	req.CameraInstance.setRecordLocation(loc);
            //    console.log("location created " + req.CameraInstance.getRecordLocation());
            //    next();
				
			//} 
			
			 try 
			 {
				 
			 // return value is the first directory created
             const made = mkdirp.sync(loc);
             console.log('made directories, starting with'+made)	; 
			 req.CameraInstance.setRecordLocation(loc);   
			 next();	 
				 
             //mkdirp(loc, function (err) {
             //   if (err) { console.log(err); }
              //  req.CameraInstance.setRecordLocation(loc);
             //   console.log("location created " + req.CameraInstance.getRecordLocation());
              //   next();
             //});
			 } catch (e) {
				 
				  req.CameraInstance.setRecordLocation('');
                  next();
				 
			 }
			
			
        } else {
            next();
        }
    } catch (e) {
         req.CameraInstance.setRecordLocation('');
        next();
    }
}
  
  
//var  activeEvents = {};
//var  eventDetails = {};

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

let  permition    =function (req, res,next  ){
	               //-------- 
	               // req.yesno='OK';
				   // next();
				   // return;
				   //---------------
				   let yesno='FAILL';
				   
	try {
		             
				 
	                let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
				
					if (ip.substr(0, 7) == "::ffff:") {
					  ip = ip.substr(7)
					}
		             console.log("client IP is from permition********************" + ip );
					 
					//  let  url = 'http://www.attiatech.net/chkpermition/connect.php?ip='+ip;
				    let url = 'http://'+config.chkpermition.url+'/chkpermition/connect.php?ip='+ip;
				    rp(url)
                    .then   (function (htmlString) {
						console.log('json..'+htmlString  );
						const obj = JSON.parse(htmlString);
						console.log('rp permition  ANSWER FROM ATTIATECH.->'+url+'--' +obj.root_name.id);
                        // Process html...
						if (obj.root_name.allowed=='1' && obj.root_name.showcamera=='1' ){
							yesno='OK'; 
							 
							
						}else{
							yesno='FAILL';
							
						}
						
						if (yesno=='FAILL' ){
							console.log('return ...... '+yesno);
				            res.json({ status: yesno }); 
                            return; 
						}else{
							req.yesno= yesno;
							next();
							
						}
						
						 
						
                  })
                   .catch(function (err) {
                       // Crawling failed...
					    console.log('rp ANSWER FROM ATTIATECH..'+err );
					    req.yesno= yesno;
						next();
						 
					     
                  });
	
	 } catch (e) {
		 req.yesno= yesno;
		 next();
	     
		 
         
    }
	
	
	
} 




let createStream = function (req, res, next) {
    try {
        let CameraInstance = req.CameraInstance;
        if (StreamsManager.isFeedExist(CameraInstance.getFeedId())) {
            log('warn', "Create Stream => Camera feed exists: " + CameraInstance.getFeedId());
            next();
            return;
        }
        log('warn', "Create Stream => Camera feed not exists: " + CameraInstance.getFeedId());
        StreamsManager.getStreamInformation(CameraInstance, function (streamInfo) {
            // update camera with streamInformation
            CameraInstance.setStreamInformation(streamInfo);
            req.CameraInstance = CameraInstance;

            next();
        });
    } catch (e) {
        next();
    }

} 
const prepareObjects = function (req, res, next) {
    try {
        log('warn', "Preparing Objects - Start");
        const configCamera = {
            username: req.body.username ? req.body.username : '',
            password: req.body.password ? req.body.password : '',
            host: req.body.host ? req.body.host : '',
            port: req.body.port ? req.body.port : '',
            channel: req.body.channel ? req.body.channel : '',
            cameraType: req.body.cameraType ? req.body.cameraType : '',
			custnumber: req.body.custnumber ? req.body.custnumber : '',
			channlrecord: req.body.channlrecord ? req.body.channlrecord : '0',
            customUrl: req.body.customUrl ? req.body.customUrl : '' 
			 
        }
        let useWebSocket = false;
        if (req.body.useWebSocket && req.body.useWebSocket != "") {
            useWebSocket = req.body.useWebSocket == "true";
        }
        const CameraInstance = new Camera(configCamera);
        req.CameraInstance = CameraInstance;
        req.useWebSocket = useWebSocket;
        log('warn', "Preparing Objects - Done  "+req.CameraInstance.getcustnumber())
        next();
    } catch (e) {
        next();
    }
}


function ValidateIPaddress(ipaddress) {  
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
    return (true)  
  }  
  console.log("You have entered an invalid IP address!")  
  return (false)  
}  

function isport(req, res,next  ){
 
    try {
		
		
		    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
				
			if (ip.substr(0, 7) == "::ffff:") {
			  ip = ip.substr(7)
			}
	        var host= req.body.host ;
            
            
            
            
            

			
			if (ValidateIPaddress(host)==false)
			{
				
				//return ;
			}
			
			
            var port= req.body.port ;
			 console.log('check port........',req.body.host,':',req.body.port,'====',ip );
			(async () => {
               
               try {
                     const address = await lookupPromise(host);
                     
                
                    var a= await isPortReachable(port, {timeout : 5000,host: address});
                    console.log(a);
                    if (a==false)
                    {
                        
                        return;
                    }else{
                        next();
                        
                    }
                     
                 } catch(err) {
                    console.error(err);
                    return;
                }
                 
				
				//=> true
			})();
			
			
			
         
    } catch (e) {
        next();
	    return;  
    }

}


 
function misport(req, res,next  ){
 
     next();
	return;
} 	

app.post('/startStream',isport,permition, prepareObjects, createStream, createFileSystem, function (req, res) {
	                    /*
	                    if (req.yesno=='FAILL')
						{
						   console.log('Port close...... '+res.body.port+' '+req.body.host);	
						   res.json({ status: 'port close' }); 
                           return; 	
							
						}
				        console.log('Remote Address...... '+req.connection.remoteAddress+'.....'+req.yesno);
				        if (req.yesno=='FAILL' ){
							console.log('return ...... '+req.yesno+'.....'+req.yesno);
				            res.json({ status: req.yesno }); 
                            return; 
						}
						*/
						let yesno=req.yesno;
						
						res.setHeader('Access-Control-Allow-Origin', '*');
				        let CameraInstance = req.CameraInstance;
						let useWebSocket = req.useWebSocket;
						log('warn', "Start Stream => " + CameraInstance.getFeedId()+" "+CameraInstance.getcustnumber());
						 
						
						
						console.log ('..................'+CameraInstance.getchannlrecord());
						//console.log ('host port.............'+req.CameraInstance.host+":"+req.CameraInstance.port);
						StreamsManager.startStream(useWebSocket, CameraInstance.getFeedId(), CameraInstance, (e) => {
							res.json({ status: yesno, feedId: CameraInstance.getFeedId() });
						});
								
					
	
});

const contentWriters = [];
//// FLV over HTTP, this URL goes in the flv.js javascript player
// see ./index.html
app.get(['/flv', '/flv/:feed'], function (req, res) {
    log('warn', "New client request to watch feed " + req.params.feed);

    if (!req.params.feed) { req.params.feed = '1' }
    //get emitter
    req.Emitter = StreamsManager.initFeed(req.params.feed)
    //variable name of contentWriter

    let contentWriter = function (buffer) {
        res.write(buffer);
    };
    //set headers
    res.setHeader('Content-Type', 'video/x-flv');
    res.setHeader('Access-Control-Allow-Origin', '*');
    //write first frame on stream

    res.write(StreamsManager.initFirstChunk(req.params.feed));
    //write new frames as they happen
    req.Emitter.addListener('data', contentWriter);
    log('success', "Number of clients for feed:  " + req.params.feed + " is: " + StreamsManager.getNumberOfClients(req.params.feed));

    //remove contentWriter when client leaves
    res.on('close', function () {
        log('warn', "Client leaves the feed " + req.params.feed);
        req.Emitter.removeListener('data', contentWriter);
        StreamsManager.getNumberOfClients(req.params.feed);

    })

});

// socket io
//socket.io client commands
// create room io.to('STREAM_'+req.params.feed).emit('h264',{feed:req.params.feed,buffer:buffer})
var  roomcontrol='';
 
io.on('connection', function (cn) {
	
	console.log('A...............in comming...connection'+cn.request.connection.remoteAddress);
      // once a client has connected, we expect to get a ping from them saying what room they want to join
    cn.on('room', function(room) {
		roomcontrol=room.toString();
		console.log('..join to room.......',room);
        cn.join(roomcontrol);
		cn.feed = roomcontrol;
		 
    });
	 
	 
	
	
	/*
	controlmessage=cn;
	controlmessage.emit('checkip', { hello: 'begin' });
    controlmessage.on('checkipdata', function (data) {
	 
    console.log(data.ip,data.port);
	
	var ret='';
    (async () => {
	
	   ret=await isPortReachable(data.port, {host: data.ip,timeout:10000});
	   if (ret==false){
		   console.log('port close...'+ret);
		   controlmessage.emit('checkipanswer', { status: ' Close' });
	  }else{
		  console.log('port open...'+ret);
		  controlmessage.emit('checkipanswer', { status: ' Open' });
		   
		  
		  
		  
	  }
	 
	 
    })();
	
	
	
	
  });
	
	*/

    cn.on('f', function (data) {
        switch (data.function) {
            case 'getStream':
                cn.join('STREAM_' + data.feed);
                cn.feed = data.feed;
                log('warn', 'connection join the feed: ' + data.feed);

                break;
        }
    });
	
	
	 
	
	
	
	
	
	
	
	
	
	
    cn.on('disconnect', function (room) {
        log('warn', 'connection leaves the socket: ' + cn.feed);
        let numberOfclients = io.sockets.adapter.rooms['STREAM_' + cn.feed] ? io.sockets.adapter.rooms['STREAM_' + cn.feed].length : 0;
        log('info', "feed: " + cn.feed + " => number of clients in the room is: " + numberOfclients);
        if (numberOfclients == 0) {
             StreamsManager.destroyWithDelay(cn.feed);
        }
		 
		 console.log("User left "+room);
		
    });
});

//ffmpeg pushed stream in here to make a pipe
 //ffmpeg pushed stream in here to make a pipe
app.all(['/streamIn/:feed/:fileLocation/:channlrecord', '/streamIn/:feed', '/streamIn/:feed/:image'], function (req, res) {
    req.Emitter = StreamsManager.initFeed(req.params.feed);
    console.log("params : " + req.params.feed);
	 
	 
    let fileLocation='';
	
    if (config.recording.enable && !config.recording.useFFMPEG && req.params.channlrecord!='') {
        fileLocation = req.params.fileLocation;
		 console.log('ddddddddddddddddddddddddd'+req.params.fileLocation);
		if (fileLocation==undefined){
			fileLocation=config.recording.locationPath+"/"+req.params.feed;
			 
		}
		try {
           fileLocation = fileLocation.replace(new RegExp('\\+', 'g'), '/').replace('-', '.');
		}
		 catch(error) {
                console.log('hhhhhhhhhhhhhhhhhhhhhhh'+error);
                fileLocation='';
             }
        console.log("fileLocation:", fileLocation);
    }else{
		return;
	}
     
     
    //req.params.feed = Feed Number (Pipe Number)
    res.connection.setTimeout(0);
    req.on('data', function (buffer) {
        req.Emitter.emit('data', buffer);
        // console.log(buffer.toString('utf8'));
        io.to('STREAM_' + req.params.feed).emit('h264', { feed: req.params.feed, buffer: buffer })
		
		 
		 
		 if (req.params.channlrecord==req.params.feed){
		 	  //console.log('before recorde'+req.params.channlrecord+'------'+req.params.feed);
			// console.log('before recorde.......'+req.params.channlrecord);
		 }
        if (config.recording.enable && !config.recording.useFFMPEG && req.params.channlrecord==req.params.feed    ) {
			
			 //console.log('----------------'+req.params.channlrecord); 
            //fs.appendFile(fileLocation + config.recording.defaultExtension, buffer, noOp);
			 //-write poster. 
			// add a line to a lyric file, using appendFile
			
              fs.appendFile(fileLocation + config.recording.defaultWriteStreamExtension, buffer, (err) => {  
                if (err) throw err;
                   //console.log('The lyrics were updated!');
               });
			   
			   //check if file exist
			   
			   if  (fs.exists(fileLocation+'.gif', function (exists) {
	                //console.log(exists);
                    if(! exists){
						 //---create 1
						 
						 // a base64 string of a gif image
                         var fileContent = "R0lGODlhPQBEAPeoAJosM//AwO/AwHVYZ/z595kzAP/s7P+goOXMv8+fhw/v739/f+8PD98fH/8mJl+fn/9ZWb8/PzWlwv///6wWGbImAPgTEMImIN9gUFCEm/gDALULDN8PAD6atYdCTX9gUNKlj8wZAKUsAOzZz+UMAOsJAP/Z2ccMDA8PD/95eX5NWvsJCOVNQPtfX/8zM8+QePLl38MGBr8JCP+zs9myn/8GBqwpAP/GxgwJCPny78lzYLgjAJ8vAP9fX/+MjMUcAN8zM/9wcM8ZGcATEL+QePdZWf/29uc/P9cmJu9MTDImIN+/r7+/vz8/P8VNQGNugV8AAF9fX8swMNgTAFlDOICAgPNSUnNWSMQ5MBAQEJE3QPIGAM9AQMqGcG9vb6MhJsEdGM8vLx8fH98AANIWAMuQeL8fABkTEPPQ0OM5OSYdGFl5jo+Pj/+pqcsTE78wMFNGQLYmID4dGPvd3UBAQJmTkP+8vH9QUK+vr8ZWSHpzcJMmILdwcLOGcHRQUHxwcK9PT9DQ0O/v70w5MLypoG8wKOuwsP/g4P/Q0IcwKEswKMl8aJ9fX2xjdOtGRs/Pz+Dg4GImIP8gIH0sKEAwKKmTiKZ8aB/f39Wsl+LFt8dgUE9PT5x5aHBwcP+AgP+WltdgYMyZfyywz78AAAAAAAD///8AAP9mZv///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAKgALAAAAAA9AEQAAAj/AFEJHEiwoMGDCBMqXMiwocAbBww4nEhxoYkUpzJGrMixogkfGUNqlNixJEIDB0SqHGmyJSojM1bKZOmyop0gM3Oe2liTISKMOoPy7GnwY9CjIYcSRYm0aVKSLmE6nfq05QycVLPuhDrxBlCtYJUqNAq2bNWEBj6ZXRuyxZyDRtqwnXvkhACDV+euTeJm1Ki7A73qNWtFiF+/gA95Gly2CJLDhwEHMOUAAuOpLYDEgBxZ4GRTlC1fDnpkM+fOqD6DDj1aZpITp0dtGCDhr+fVuCu3zlg49ijaokTZTo27uG7Gjn2P+hI8+PDPERoUB318bWbfAJ5sUNFcuGRTYUqV/3ogfXp1rWlMc6awJjiAAd2fm4ogXjz56aypOoIde4OE5u/F9x199dlXnnGiHZWEYbGpsAEA3QXYnHwEFliKAgswgJ8LPeiUXGwedCAKABACCN+EA1pYIIYaFlcDhytd51sGAJbo3onOpajiihlO92KHGaUXGwWjUBChjSPiWJuOO/LYIm4v1tXfE6J4gCSJEZ7YgRYUNrkji9P55sF/ogxw5ZkSqIDaZBV6aSGYq/lGZplndkckZ98xoICbTcIJGQAZcNmdmUc210hs35nCyJ58fgmIKX5RQGOZowxaZwYA+JaoKQwswGijBV4C6SiTUmpphMspJx9unX4KaimjDv9aaXOEBteBqmuuxgEHoLX6Kqx+yXqqBANsgCtit4FWQAEkrNbpq7HSOmtwag5w57GrmlJBASEU18ADjUYb3ADTinIttsgSB1oJFfA63bduimuqKB1keqwUhoCSK374wbujvOSu4QG6UvxBRydcpKsav++Ca6G8A6Pr1x2kVMyHwsVxUALDq/krnrhPSOzXG1lUTIoffqGR7Goi2MAxbv6O2kEG56I7CSlRsEFKFVyovDJoIRTg7sugNRDGqCJzJgcKE0ywc0ELm6KBCCJo8DIPFeCWNGcyqNFE06ToAfV0HBRgxsvLThHn1oddQMrXj5DyAQgjEHSAJMWZwS3HPxT/QMbabI/iBCliMLEJKX2EEkomBAUCxRi42VDADxyTYDVogV+wSChqmKxEKCDAYFDFj4OmwbY7bDGdBhtrnTQYOigeChUmc1K3QTnAUfEgGFgAWt88hKA6aCRIXhxnQ1yg3BCayK44EWdkUQcBByEQChFXfCB776aQsG0BIlQgQgE8qO26X1h8cEUep8ngRBnOy74E9QgRgEAC8SvOfQkh7FDBDmS43PmGoIiKUUEGkMEC/PJHgxw0xH74yx/3XnaYRJgMB8obxQW6kL9QYEJ0FIFgByfIL7/IQAlvQwEpnAC7DtLNJCKUoO/w45c44GwCXiAFB/OXAATQryUxdN4LfFiwgjCNYg+kYMIEFkCKDs6PKAIJouyGWMS1FSKJOMRB/BoIxYJIUXFUxNwoIkEKPAgCBZSQHQ1A2EWDfDEUVLyADj5AChSIQW6gu10bE/JG2VnCZGfo4R4d0sdQoBAHhPjhIB94v/wRoRKQWGRHgrhGSQJxCS+0pCZbEhAAOw==";

                       // The absolute path of the new file with its name
                     var filepath = fileLocation+'.gif' 

                    // Save with a buffer as content from a base64 image
                    fs.writeFile(filepath, new Buffer(fileContent, "base64"), (err) => {
                        if (err) throw err;

                            console.log("The file was succesfully saved!");
                     }); 
						 
						   
						 //ffmpeg -i 147235492345541.flv -ss 1 -vf scale=320:-1:flags=lanczos,fps=15 outputfile.gif
						 ffmpegx(fileLocation+'.stream').seekInput(1).format('gif').save(fileLocation+'.gif').on('end', function() {
                             console.log('Finished gif Poster processing');
							  
							 
                          });
						   
					     
                    } else {
                         
                    }
                  }));
			   
			   
			   
			   
			
			
			
			
        }
    });

    req.on('end', function () {
        console.log('close..............................');
        io.to('STREAM_' + req.params.feed).emit('h264-error', { feed: req.params.feed, message: "STREAM_CLSOED" })

    });

});

const globalStreamsManagerMessageHandler = StreamsManager.getGlobalEventHandler();
globalStreamsManagerMessageHandler.on("STREAMS_MANAGER", (data) => {
    log('info.....................', data);
		
	 
    if (data.connectionType == true) {
		console.log('Data message Q...'+data.message+'---'+data.feed);
	
		
		//controlmessage.emit('checkipanswer', { status: data.message });
        // its websocket connection, need to notify users
        io.to('STREAM_' + data.feed).emit('h264-error', { feed: data.feed, message: data.message ? data.message : '' });
		  
		 
		 // now, it's easy to send a message to just the clients in a given room
         var room = roomcontrol ; //"abc123";
		 
		 
		 
		 
		 
         
		 io.sockets.in(room).emit(roomcontrol, {custnumber:room,message:data.message+room,feed: data.feed});
		  

    }
});
 log('info',  './records');

 

var t = setInterval(function(){tryToConnect();}, 15000);
function tryToConnect(){
	
	
	 
	var timewait=config.recording.timer ;   //24 hours
	var loc = config.recording.locationPath+"/"  ;  
   // console.log('timer',loc); 	  
	  
 var removed = findRemoveSync(loc, {extensions: ['.gif', '.flv','.stream','.mp4','.jpeg','.265','.264'],age: {seconds: timewait},maxLevel: 10 , limit: 1000})
	//console.log('removed:', removed); 
  if (removed.length > 0) {
     console.log('removed:', removed);
  }
	
	 
	// log('info', 'if empty  ' +  loc   ) ;
	
	
	var  indexOfFirst = loc.indexOf('records');
     //log('info',  indexOfFirst);
     
		if (indexOfFirst>=0){
		   try {	
		     cleanEmptyFoldersRecursively(loc);
		   }catch(err){
			  //log('info',  err); 
		   }
		}
	 



	
}

 function cleanEmptyFoldersRecursively(folder) {
   // var fsf = require('fs');
   // var path = require('path');

    var isDir = fsf.statSync(folder).isDirectory();
	 
	  
    if (!isDir) {
		 //console.log('isDir....'+  isDir+ " "+folder);
			
      return;
    } 
	 
	
	 fsf.stat(folder, function(err, stats){
      var mtime = (new Date().getTime()-stats.birthtime) / 1000;
      //console.log(mtime);
	   if (mtime<50){
	 	  return;
	  }
    
	 
	
	
	
    var files = fsf.readdirSync(folder);
	//console.log('file len '+files.length);
    if (files.length > 0) {
      files.forEach(function(file) {
        var fullPath = path.join(folder, file);
        cleanEmptyFoldersRecursively(fullPath);
      });

      // re-evaluate files; after deleting subfolder
      // we may have parent folder empty now
      files = fsf.readdirSync(folder);
    }

    if (files.length == 0) {
	  try
	  {	  
      console.log("removing: ", folder);
      fsf.rmdirSync(folder);
	  } catch(err) {
           console.log(err.message);
      }
	  
	  
	  
      return;
    }
	
	});
	
	
	
	
  }




function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function isEmptyDir(dirnane){
    try{
        fs.rmdirSync(dirname)
    }
    catch(err){
        return false;
    }
    fs.mkdirSync(dirname);
    return true
}


  
  
 function lookupPromise(a) {
    return new Promise((resolve, reject) => {
        dns.lookup(a, (err, address, family) => {
            if(err) reject(err);
            resolve(address);
        });
   });
};





process.on('uncaughtException', function (error) {
    console.log(error);

});