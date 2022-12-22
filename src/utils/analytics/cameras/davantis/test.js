
"use strict";
 

var   fs = require('fs') ;
var http = require('http');
const mydavantis = require('./davantis.js');
var   moment = require('moment');


                 var utcTime = "2020-04-23T15:21:50Z";

                 var local_date= moment.utc(utcTime ).local().format('YYYYMMDDHHmm');
                 console.log(local_date); 

//  'http://185.27.106.196:21010/oauth/token',
//    { body:  '?grant_type=password&username=admin&password=123456'   }, 

var options = {
	host: '82.166.145.191',
    port: 21000,
    user: 'admin',
    pass: 'davantis',
	mokedccode:'70000'
	 
};


 
 
 



 var download = function(url, dest ,cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  });
}



  //"video_absolute":"http://185.27.106.196:21010/alarms/19894/video.mp4" 
			 var url="http://185.27.106.196:21010/alarms/19894/video.mp4";
			 var dest='c:/record/record.mp3';
			 var cb='';
             //download (url, dest ,cb);

 var obj={"fault":{"faultstring":"Invalid Access Token","detail":{"errorcode":"keymanagement.service.invalid_access_token"}}};
 
 if (("fault" in obj)){
	 console.log("errorcode.................");
  
 
								 if (obj['fault']['detail']['errorcode'] =="keymanagement.service.invalid_access_token") {
									 console.log("errorcode................."+obj['fault']['detail']['errorcode']); 
								 }	 
 }								 
								 
								 
								  

 
 
let a = new mydavantis(options );
 
 
  
  
  
    a.start();
    
 	
	
a.on( 'connect', function( cb )    {
		console.log('connect   ' +cb); 
	})	
	
a.on( 'close', function( cb )    {
		console.log('close   ' +cb); 
	})		
	
a.on( 'alarm', function( a,b,c ) {
		console.log('alarm   ',a,b,c); 
	})
	
a.on( 'data', function( a  ) {
		 console.log('data   ',a ); 
	})	
	
	//'connection-error'
a.on( 'connection-error', function( ax  ) {
		 console.log('connection-error   ',ax );
        // a.stop();
        //a.start();


		
       
		
	})	
	
	a.on('error', function (err) {
	
	console.log('error.PROCESSOR..... '+err);
	 
		 a.stop();
	 
	     //a.stop();
	    
	
	
	 
});
		 
	
	
	 
