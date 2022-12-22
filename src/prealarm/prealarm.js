const request = require('request');
var io = require('socket.io-client');

var fs = require('fs');
var ini = require('ini');
//var jsonfile = require('jsonfile');
// var config = ini.parse(fs.readFileSync('c:/xampp/htdocs/phpproject2/fconfig/global.ini', 'utf-8'));
var config = ini.parse(fs.readFileSync('global.ini', 'utf-8'));
console.log(config);
var json='';
var net = require('net');
var HOST = config.h1.HOST;//'192.168.2.106';
var PORT =  config.h1.PORT;//49066;
//------
var streamBaseUrlEXT=config.streamanager.EXT;
var streamBaseUrlLOC=config.streamanager.LOC;
var streamBaseUrlPORT=config.streamanager.PORT;
 

 var ip = require("ip");
console.dir ( 'my ip server '+ip.address() );
/*redirect post for recorde on the proper server ip.....
  if (ip.address()==config.streamanager.LOC){
	   
	  var url= 'http://'+streamBaseUrlLOC+':'+streamBaseUrlPORT+'/startStream';// url: 'http://localhost:5000/startStream',
	    
      var base='http://'+streamBaseUrlLOC+':'+streamBaseUrlPORT ;//  base:'http://localhost:5000',
  }
  
*/

var aip=ip.address().split('.');
var cip=config.streamanager.LOC.split('.');


console.log(aip[0])
console.log(cip[0])

if (aip[0]==cip[0] && aip[1]==cip[1] && aip[2]==cip[2]){
	   
	  var url= 'http://'+streamBaseUrlLOC+':'+streamBaseUrlPORT+'/startStream';// url: 'http://localhost:5000/startStream',
	    
      var base='http://'+streamBaseUrlLOC+':'+streamBaseUrlPORT ;//  base:'http://localhost:5000',
  }else{
	  var url= 'http://'+streamBaseUrlEXT+':'+streamBaseUrlPORT+'/startStream';// url: 'http://localhost:5000/startStream',
	    
      var base='http://'+streamBaseUrlEXT+':'+streamBaseUrlPORT ;//  base:'http://localhost:5000',
	  
	  
	  
  }







var streamBaseUrlEXTBAK=config.streamanager.EXTBAK;

var streamBaseUrlPORTBAK=config.streamanager.PORTBAK;



var urlback= 'http://'+streamBaseUrlEXTBAK+':'+streamBaseUrlPORTBAK +'/startStream';// url: 'http://localhost:5000/startStream',
	    
var baseback='http://'+streamBaseUrlEXTBAK+':'+streamBaseUrlPORTBAK  ;  //  base:'http://localhost:5000',
console.log(urlback);
console.log(baseback);

var isConnected=0;
var connectionsAttemptCounter=0;
var TCPSERVER = new net.Socket();
TCPSERVER.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
	connectionsAttemptCounter=0;
	isConnected=1;
	TCPSERVER.write("$SLURTSP,09*");
	 
    

});

/**
* data event from TCP server to broadcast to everyone
*/
TCPSERVER.on('data', function(data) {
    console.log('DATA: ' + data);
	
	    //var stringtrim = data.toString()  ;
		var datastr=data.toString().replace('*', '').replace('$','');
        //var x=p;
        //var datastr=x.replace('$', '') 

          
		 
		 
 
        var messageDetails = datastr.toString().split(",");
		var command = messageDetails[0];
	    console.log('CUST : ' + messageDetails[0]);
		console.log('IP : ' + messageDetails[1]);
		console.log('PORT : ' + messageDetails[2]);
		console.log('USER : ' + messageDetails[3]);
		console.log('PASS : ' + messageDetails[4]);
		console.log('CH : ' + messageDetails[5]);
		console.log('TYPE : ' + messageDetails[6]);
		//DATA: $90000,37.142.115.48,554,admin,a1234,7,DH*
		
		let options = {  
         url: url,
	     base:base,
	 
         form: {
         
                username: messageDetails[3].trim(),
                password: messageDetails[4].trim(),
                host: messageDetails[1].trim(),
                port: messageDetails[2].trim(),
                cameraType: messageDetails[6].trim(),
                channel: messageDetails[5].trim(),
				custnumber:messageDetails[0].trim(),
	            channlrecord:messageDetails[5].trim(),
				useWebSocket: true 
				
				 /*username: 'admin',
                password: 'a1234',
                host: '37.142.115.48',
                port: '554',
                cameraType: 'DH',
                channel: '7',
				custnumber:'90000',
	            channlrecord:'7',
				
                useWebSocket: true
				*/
				
				
             
            }
          };
		  
		  let optionsbak = {  
         url: urlback,
	     base:baseback,
	 
         form: {
                
                 username: messageDetails[3].trim(),
                password: messageDetails[4].trim(),
                host: messageDetails[1].trim(),
                port: messageDetails[2].trim(),
                cameraType: messageDetails[6].trim(),
                channel: messageDetails[5].trim(),
				custnumber:messageDetails[0].trim(),
	            channlrecord:messageDetails[5].trim(),
				useWebSocket: true 
				 
				/*  username: 'admin',
                password: 'a1234',
                host: '37.142.115.48',
                port: '554',
                cameraType: 'DH',
                channel: '7',
				custnumber:'90000',
	            channlrecord:'7',
				
                useWebSocket: true
				*/
				 
				
				
				
				
				
				
				
				
				
             
            }
          };
		  var skipcamera=messageDetails[6].trim();
		  if (skipcamera.indexOf('IPCAM') > -1) {
			  return ;
		  }
	  
	      //connect to main camera server.
		   console.log('before ....'+options);
           CamRecordeByevent(options, function(id) {
           console.log('RetCamera.1...'+id);  
           if (id==false){
		    // connect to backup camera server
		       CamRecordeByevent(optionsbak, function(id){console.log('RetCamera back.....'+id); });
		
	       }	
         });
	  
	  
		
		
		
		
		
		
		
		
	
	 
    
});

/**
* close event for TCP server
*/
TCPSERVER.on('close', function() {
    console.log('Connection closed');
	isConnected=0;
	connectionsAttemptCounter=1;
	 
});





//---handle all the clients for recorde chanel's   
const sockets = []; 

/**
     * @options
      
     * @description - send parameters to recorde camera...on rtsp-min-15
     


 
let options = {  
    url: 'http://localhost:5000/startStream',
	base:'http://localhost:5000',
	 
    form: {
         
                username: 'admin',
                password: 'a1234',
                host: '37.142.115.48',
                port: '554',
                cameraType: 'DH',
                channel: '7',
				custnumber:'90000',
	            channlrecord:'7',
				
                useWebSocket: true
             
    }
};


let options1 = {  
    url: 'http://rtsp-15-min.herokuapp.com:80/startStream',
	base:'http://rtsp-15-min.herokuapp.com:80',
	 
    form: {
         
                username: 'admin',
                password: 'a1234',
                host: '37.142.115.48',
                port: '554',
                cameraType: 'DH',
                channel: '7',
				custnumber:'90000',
	            channlrecord:'7',
				
                useWebSocket: true
             
    }
};
 
 //connect to main camera server.
 //CamRecordeByevent(options, function(id) {
 //   console.log('RetCamera.....'+id);  
 //   if (id==false){
//		// connect to backup camera server
//		CamRecordeByevent(options1, function(id){});
		
//	}	
//});
*/
 

 /**
     * @function
     * @name CamRecordeByevent
     * @param {options} camera - camera object.
       
     * @description - connect to camera ..for 5 min. recorde.
     */



function CamRecordeByevent(options, cb){
  
var retc=false;	


var r= request.post(options,function (error,response,body){
	
	if (response==undefined){
		console.log('body  '+error );
		//console.log('body  '+response.statusCode );
		   
		  cb(false);
		   r.end();
		   r.abort();
		 
		   return;
		   
	} 
	
	  
	  
	  
	try {  
	  
	  json = JSON.parse(body);
	
	  console.log('Post..startStream '+json.status);
	  console.log('Post..startStream '+json.feedId);
	  console.log('Post..startStream '+options.url); 
	  console.log('Post..startStream '+options.form.host); 
	  console.log('Post..startStream '+error);
	
	
	
	
	
	
	
	
	}
      catch(error) {
      console.error(error);
     // expected output: ReferenceError: nonExistentFunction is not defined
     // Note - error messages will vary depending on browser
	 
	       cb(false);
		   r.end();
		   r.abort();
		 
		   return;
	 
	 
	 
	 
	 
     }
	
	
	if (json==undefined){
		 cb(false);
		   r.end();
		   r.abort();
		 
		   return;
		
	}
	
	
	
	 
	  
	  
	 if (sockets[json.feedId]){
		 console.log ('allready ..in..');
		 cb(true);
		 
		 r.end();
		 r.abort();
		 
		 return;
	 }
	  
	 
	 
	 
	 
	 
	 
	sockets[json.feedId] = io.connect(options.base);
    sockets[json.feedId].on('connect', function () { console.log("socket connected...1"); 
	
	
	
	
	           let socket = sockets[json.feedId];
               if (socket) {
	 
     
	             //pretend this is the command you use to initiate getting H.264 (MPEG) data
                  sockets[json.feedId].emit('f', { function: 'getStream', feed: json.feedId });
			     //var Rt for Handle timeout for clear if error
			  
                  var Rt=setTimeLimit(json.feedId);
			 
			   }
			  
			  
				 //sockets[json.feedId].on('event', function(data){console.log("socket event")});
				 
				 
				 sockets[json.feedId].on('disconnect', function()
				 
				   {
					   console.log("socket disconnected");
					   let socket = sockets[json.feedId];
                       if (socket) {
                 
                         console.log(  "Terminating process from timer=> " +json.feedId);
				         sockets[json.feedId].disconnect() 
                         delete sockets[json.feedId];
				
                       }
					    
			            
					   
				  
				       r.end();
				       r.abort();
				       clearTimeout(Rt);
				
				       retc=true;
			           cb(retc); 
			     
			  
			       });
	
	          sockets[json.feedId].on('h264-error', function(data) {
                console.log(data);
				
				console.log(  "Terminating process => 2" + json.feedId);
				sockets[json.feedId].disconnect() 
                delete sockets[json.feedId];
				 r.end(); 
				 clearTimeout(Rt);
				
				retc=false;
				cb(retc);
				 
			    
				
        });
		
		
		 retc=true;
		 cb(retc); 
		 

    });
	
});  
 
  
}
  
  
   function setTimeLimit(feed) {
         var Rt=setTimeout(function () {
            let socket = sockets[feed];
            if (socket) {
                 
                console.log(  "Terminating process from timer=> " + feed);
				sockets[feed].disconnect() 
                delete sockets[feed];
				
            }
        }.bind(this), 60000);
        return Rt;
    }
	
	
	
	
/**
 TIMERS
 check if the TCP server connection is down, then try to connect, otherwise do nothing
 */

var t = setInterval(function(){tryToConnect();}, 5000);
function tryToConnect(){
	
		
		if(connectionsAttemptCounter==1){
			console.log("Trying to connect...");
			try{
				connectToServer();
			}catch(e){
				console.log(e);
			}
		
		}
	
}
/**
connect to the TCP server 
*/
function connectToServer(){
	TCPSERVER.connect(PORT, HOST, function() {
					console.log('CONNECTED TO: ' + HOST + ':' + PORT);
					isConnected=1;
					TCPSERVER.write("$SLURTSP,09*");
					connectionsAttemptCounter=0;
					 
					
					
	});
}
process.on('uncaughtException',function(error){
	console.log(error);

});
	
  

 
    

 
   

 