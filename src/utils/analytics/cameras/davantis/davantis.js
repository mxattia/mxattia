"use strict";
 

// Define Globals
var TRACE = false;

var  globalConfig = require("../../../../config.js");

 console.log(globalConfig.default.recording.locationPath);

var request = require('request');

var http = require('http'),
    querystring = require('querystring'),
    fs = require('fs') ;
	
const Path = require('path')  ;
const Axios = require('axios');	
const mkdirp = require('mkdirp')
var   moment = require('moment');

	
var xml2js = require('xml2js');
 var convert = require('xml-js');	
	
 
 var parseString = require('xml2js').parseString;
   
  
   
//Utils.createTimeStamp()    
	 
 
	
	
const EventEmitter = require( 'events' );	


 

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

/* ============================================================
  Function: Download Image
============================================================ */ 
async function downloadImage (url,fname,dest) {  
   
  const path =  Path.resolve( dest, '', fname);
  const writer = fs.createWriteStream(path);
  writer.on('error', function(err) {
    console.log(err);
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
	console.log('save '+fname);
	response.data.pipe(writer);
})  
    .catch(error => {  
    //console.log(error);
     writer.end();	
});  
    
 
}

 
 


function comparer(otherArray){
  return function(current){
    return otherArray.filter(function(other){
      return other.id == current.id && other.snapshot_status == current.snapshot_status && other.video_status == current.video_status
    }).length == 0;
  }
};
 

class davantis extends EventEmitter {
	
	constructor(options) {
	 super();	
	    
     this.host = options.host;
	 
	  
     this.port=options.port;
     this.user= options.user;
     this.pass= options.pass;
	 this.mokedccode=options.mokedccode;
	 
	 
     //console.log(options) ;
	  
	
	 this.lastevents='222222';
	 this.starttime = Date.now();
	 this.eventTime='';
	 this.arrayh=[];
	 this.isconnect=false;
	 this.auth_header='';
	 this.cont=false;
	 
	 this.access_token ='';
	 this.token_type ='';
	 this.refresh_token =''; 
	 this.intervalRefreshToken='';
	 this.interval='';
	 
	 
	 
	  
	   
  }
  
  
  
    
	
	
    start1(){
	     let _this = this; 
	  
         _this.getAlarm(function( cb ) {
	        //console.log('cb................  '+cb.length);
			
			 var data=  cb;
			  var result = {};
			   var millis=0;
									 
			   _this.handleDavantisEventDatax(  _this, data,result,millis);	 
			
			
       });

	    
	     console.log('run ' );

   }
  
   
    start (){
	    let _this = this; 

		 this.gettoken( _this,function( cb )
		    {
				
				console.log('cbdddddddddddddddd............  '+cb);
		            //_this.interval = setInterval(_this.getAlarm.bind(_this), 5000);
					_this.interval = setInterval(_this.start1.bind(_this), 5000);
					
					 
                    _this.intervalRefreshToken=setInterval(_this.RefreshToken.bind(_this) ,15000);
					
					
					
					
		    }) ;
         
	     // this.getAlarm(  function( cb ){console.log('aaaaaaaaaaaaaaaaaa................  '+cb);}) ;
	     //_this.interval = setInterval(_this.getAlarm.bind(_this),  5000);
	    //_this.interval = setInterval(_this.start1.bind(_this), 5000);
	  
    };
   
    stop(){
          let _this = this; 	  
	      clearInterval(_this.interval )  ;
		  clearInterval(_this.intervalRefreshToken);
	      console.log('stop ' );
		 _this.emit("close",'stop');
		  this.isconnect=false;
    };
    
    
   
	
 RefreshToken()
 {
	 let _this = this; 
	  
        
     _this.getRefreshToken( _this,function( cb )
	 	    {
				
		   	 	console.log('refresh token............  '+cb);
		            
					
		    }) ;


 }	 
   
   
	
 gettoken(self,cb)	{
	
	   let _this = self;	
	   console.log('OPTIONS.....'+_this.host  );
	 
	    console.log('this.auth_header.............'+'?grant_type=password&username='+_this.user+'&password='+_this.pass );
		 
		var req =request.post(
		'http://'+_this.host+':'+_this.port+'/oauth/token',
		  
		{ body:  '?grant_type=password&username='+_this.user+'&password='+_this.pass ,forever: true ,timeout:0  },
		 
		
		function (error, response, body) {
			if (!error && response.statusCode == 200) {
				 console.log(body);
				 
				var as = JSON.parse(body);
				 
		  
		        //console.log(as['access_token']);
			    //console.log(as['token_type']);
			    //console.log(as['refresh_token']);
				
				//'/installation', 
				 _this.access_token =as['access_token'];
	             _this.token_type =as['token_type'];
	             _this.refresh_token =as['refresh_token']; 
				
				
				
				
				  _this.auth_header= {'Authorization': 'Bearer '+as['access_token']};
				  cb('Connected');
				  console.log('this.auth_header..get token........'+_this.auth_header);
			     //_this.emit("connect",'on');
                 
                 setTimeout(function(){
                            console.log('send connect...')
                            _this.emit("connect",'on');
                            },3000);
                 
                 
                 
                 
                 
                 
                 
                 
                 
				
			 }else{
				  console.log('oauth/token'+error);
				   _this.stop();
				   _this.emit("error",error );
			 }
			 
		})
		
		// disconnect
         // req.end()
	 
    }
	
getRefreshToken(self,cb ){
 let _this = self;
	    
	   var req=request({
						headers:  _this.auth_header  ,
						uri: 'http://'+_this.host+':'+_this.port+'/oauth/token',
						body: 'grant_type=refresh_token&refresh_token='+_this.refresh_token,
						method: 'POST',
						forever: true ,
						timeout:0,
						 
						  }, function (err, res, body) {
							 console.log(body+_this.refresh_token);
							 
							 if (err)
							 {
								console.log(err+'err from refresh');  
								return ;
								 
							 }
							 try {
							     var as = JSON.parse(body);
								 //console.log(body);
								 
								  if (("fault" in as)){
	                                   
  
 
										 if (as['fault']['detail']['errorcode'] =="keymanagement.service.invalid_access_token") {
											  console.log("errorcode................."+as['fault']['detail']['errorcode']); 
											 
											 // _this.stop();
				                            // _this.emit("error",error );
											  
											return ; 
										 }	 
                                 }		
								 
								  
								
								 _this.access_token  = as['access_token'];
								 _this.token_type    = as['token_type'];
								 _this.refresh_token = as['refresh_token']; 
								 
								 //_this.auth_header= {'Authorization': 'Bearer '+as['access_token']};
								   _this.auth_header= {'Authorization': 'Bearer '+_this.access_token};	
									 
								  cb('body..getRefreshToken....'+body);
								
							 } 
							 catch(error) {
                                  cb('errrr..getRefreshToken....'+error);
								 return ;
							 }
							  
							  
							
							 
							  
									 
									 
							  
							 
				        }) 
						
						// disconnect
                        
								
						 
				 
			
        }	
	
	
 
	
//------------------getalarm
getAlarm(cb )	{
	     
	   let _this = this;
	   var query = '?cra=yes';
	   console.log('auth_header..getAlarm(....'+_this.auth_header['Authorization']);
	   var req=request({
						headers:  _this.auth_header  ,
						uri: 'http://'+_this.host+':'+_this.port+'/alarms'+query,
						body: '',
						method: 'GET',
						timeout:0,
						forever: true ,
						  }, function (err, res, body) {
							 // console.log('111get..'+body );
							 if (err)
							 {
								  console.log('body err alarms..'+err  );
								   
								  if (err.toString().indexOf("EHOSTUNREACH" | "ETIMEDOUT"  )>0){
									      console.log('EHOSTUNREACH..'+err  );
                                          //--change 04-12-2022
									      _this.stop();
									      _this.emit( 'error', err );
	                                    
									  
								   }
								 
								return ;
								 
							 }
							 try {
							    var alarms = JSON.parse(body);
							 } 
							 catch(error) {
                                console.log('err....parse...'+error);
								   _this.stop();
								   _this.emit( 'error', error );  
								
								 return ;
							 }
							  
							         
									 var data=  alarms;
									// var result = {};
									// var millis=0;
									 
							        // _this.handleDavantisEventDatax(  _this, data,result,millis);	 
							           cb(data);
							 
				        }) 
						
						
                         
								
						 
				 
			
        }
		 


	
	
 

				 /*
				 request({
						headers:  auth_header  ,
						uri: 'http://'+_this.settings.host+':'+_this.settings.port+'/installation',
						body: '',
						method: 'GET'
						  }, function (err, res, body) {
							////console.log('111get..installation '+body+err+res.statusCode);
				        });
						
						//body = 'grant_type=refresh_token&refresh_token=V3Ie7G6xznWkgzQY'
						//	connection.request('POST', '/oauth/token', body)
						//	print(connection.getresponse().read().decode()) 
						*/
				/*		
                request({
						headers:  auth_header  ,
						uri: 'http://'+_this.settings.host+':'+_this.settings.port+'/oauth/token',
						body: 'grant_type=refresh_token&refresh_token='+as['refresh_token'],
						method: 'GET'
						  }, function (err, res, body) {
							////console.log('111post..'+body  );
							 
							
							
				        });
                 */
  					 
				
				/*
				request({
						headers:  auth_header  ,
						uri: 'http://'+_this.settings.host+':'+_this.settings.port+'/cameras',
						body: '=None',
						method: 'GET'
						  }, function (err, res, body) {
							 //console.log('111get.camera .'+body);
							 var cameras = JSON.parse(body);
							  //console.log ('cameras    '+cameras['0']['id']);
							 
							 
				        });
					*/	
						
				 
							 ////console.log(alarms['0']['id']);
							 ////console.log(alarms['0']['video_status']);
							 ////console.log(alarms['0']['description']); 
							 ////console.log(alarms['0']['started']);
							 
							 /*
							    "id":19894,
								"idmachine":"EE1D010338",
								"idrule":4,
								"idevent":11,
								"idcamera":1,
								"description":"detected.intruder",
								"description_translation":"Intruder detected",
								"started":"2020-04-23T15:21:44Z",
								"ended":"2020-04-23T15:21:50Z",
								"video_status":"ready",
								"video_absolute":"http://185.27.106.196:21010/alarms/19894/video.mp4",
								"ack":"N",
								"snapshot_status":"ready",
								"snapshot_absolute":"http://185.27.106.196:21010/alarms/19894/snapshot",
								"supportvideo_status":"unavailable",
								"supportvideo_absolute":""},
								
								
								1=>  Movement
								2 => Person
								3 => Vehicle
								7 => Other
								10 => Sabotage
								11 => Intrusion
								18 => External trigger

								 snapshot('c:\',cb );
								
								
							 */
							  
						 
 

//-------------------------------------

//conect

// this.isconnect=false;


IsConnect  ( ) {
	 //console.log( this.isconnect);
	 return this.isconnect;
}


  


 handleDavantisEventDatax( self, data,result,millis) {
  //if (TRACE)  //console.log('Data: ' + data );
  
   //console.log('Data: ' +Array.isArray(data));
  //console.log('Data: ' , data );
           //self.getRefreshToken(self,function( cb )
	 	   //{
				
		  //	 	console.log('refresh token............  '+cb);
		            
					
		  //  }) ;
  
   
    
   
   
   if (Array.isArray(data)==false){
	   
	     console.log('array............  ');
	     //self.emit( 'error','data false' );  
	     //self.stop();
		
		 
	   
	   return ;
   }
   self.cont=false;
  
  
  if (self.arrayh.length==0){
      self.arrayh=data;
  } 
  
  
  var onlyInA = data.filter(comparer(self.arrayh));
  var onlyInB =self.arrayh.filter(comparer(data));


  var resultx = onlyInA.concat(onlyInB);

   console.log(resultx.length);
  
  
  
  
  
  ////console.log(data.length);
   
 //var interval =  20 *1000 ; // 10 seconds;
   
  //data=self.array_diff( data,self.arrayh )  ; 
  var i = Object.keys(resultx);
  i.forEach(function(id){
	// //console.log(data[id]['id']+' '+data[id]['idevent']);
	       
	        try {
			  var TimeStamp=createTimeStamp() ;	
			  var code   = data[id]['idevent'].toString().trim();
			  var action = 'Start' ;
			  var index  = parseInt(data[id]['idcamera'].toString().trim());
			  var count  = parseInt(data[id]['id']);
			}
			
			 catch(error) {
                console.error('hhhhhhhhhhhhhhhhhhhhhhh'+error);
                  // expected output: ReferenceError: nonExistentFunction is not defined
                  // Note - error messages will vary depending on browser
				  return ;
             }
			// give codes returned by camera prettier and standardized description
			if (code === '2') code = 'Person';
			if (code === '3') code = 'Vehicle';
			if (code === '7') code = 'Other';
			if (code === '10') code = 'Sabotage';
			if (code === '11') code = 'Intrusion';
			if (code === '18') code = 'External';
	 
	 
	 
	 
	 
     
		/*
		1=>  Movement
								2 => Person
								3 => Vehicle
								7 => Other
								10 => Sabotage
								11 => Intrusion
								18 => External trigger
		
		  */  
		  
		   //---save video and picsnapshot_status video_status

           if (data[id]['video_status']=='ready'){
			 //"video_absolute":"http://185.27.106.196:21010/alarms/21973/video.mp4" 
			    var url=data[id]['video_absolute'].toString().trim();
			   //data[id]['snapshot_absolute'].toString().trim();
			   //var url="http://185.27.106.196:21010/alarms/20248/video.mp4";
			   //456789/462101231495541/201904281039/462101231495541.stream
			   //20150snap.jpeg
			    var host  = self.host.split('.').join("");
			    //console.log(globalConfig);
			      
				
				 var utcTime = data[id]['ended'];
				 
				 if (utcTime=='Invalid date'){
					 console.log('Invalid date',utcTime);
					 
					 return ;
				 }
				 
				 var dir_date=moment.utc(utcTime ).local().format('YYYYMMDDHHmm').toString().trim();
				 
				 if (dir_date=='Invalid date'){
					 
					 dir_date=TimeStamp;
					 return ;
				 }
				 
				 
                 var local_date=  dir_date+"/"+ data[id]['id'].toString().trim();
				 
				 if (local_date=='Invalid date'){
					 console.log('Invalid date',local_date);
					
					 return ;
				 }
				 
				
				 var dest= globalConfig.default.recording.locationPath+'/'+self.mokedccode+"/"+host+self.port+data[id]['idcamera'].toString().trim()+"/"+ local_date  ;
			     console.log(dest);
				
				
				
			    var fname=data[id]['id'].toString().trim()+'snap.mp4';
			  
			     mkdirp.sync(dest) ;
				 //downloadImage (url,fname,dest);
			    var fun=i.toString().trim()+'mp4';
			     
			  
			     
				   downloadImage (url,fname,dest);
			     console.log('mp4..............'+fun);    
			 
		    } 

           if (data[id]['snapshot_status']=='ready'){
			 //"video_absolute":"http://185.27.106.196:21010/alarms/19894/video.mp4" 
			  var url=data[id]['snapshot_absolute'].toString().trim();
			  //data[id]['snapshot_absolute'].toString().trim();
			// var url="http://185.27.106.196:21010/alarms/20248/video.mp4";
			 //456789/462101231495541/201904281039/462101231495541.stream
			 //20150snap.jpeg
			   var host  = self.host.split('.').join("");
			    //console.log(globalConfig);
				
				 var utcTime = data[id]['ended'];
				 
				 if (utcTime=='Invalid date'){
					 console.log('Invalid date',utcTime);
					 utcTime=TimeStamp;
					 return ;
				 }
				 
				 
				 var dir_date=moment.utc(utcTime ).local().format('YYYYMMDDHHmm').toString().trim();
				 
				 if (dir_date=='Invalid date'){
					 
					 dir_date=TimeStamp;
					  return ;
				 }
				 
				 
                 
				  var local_date=  dir_date+"/"+ data[id]['id'].toString().trim();
				 
				 if (local_date=='Invalid date'){
					 console.log('Invalid date',local_date);
					
					 return ;
				 }
				 
				 
				 
				 
				 
				 

                 
				 
				 //console.log('local date....',local_date);
				 
				
			   //var dest='c:/jsmkd/rtsp-15-min/'+globalConfig.default.recording.locationPath+'/'+self.mokedccode+"/"+host+self.port+data[id]['idcamera'].toString().trim()+"/"+ TimeStamp  ;
			    var dest= globalConfig.default.recording.locationPath+'/'+self.mokedccode+"/"+host+self.port+data[id]['idcamera'].toString().trim()+"/"+ local_date  ;
			   
			   console.log(dest);
			   var fname=data[id]['id'].toString().trim()+'snap.jpeg';
			   
			   
			   
			  
			   mkdirp.sync(dest) ;
			   var fun=i.toString().trim()+'jpeg';
			    
			 
				    downloadImage (url,fname,dest);
				  console.log(fun);



                  self.emit("alarm", code,action, data[id]['idcamera'] );
				  
				  
			 
		   } 








		    if (data[id]['snapshot_status']=='ready'){
								 	   
			 
		        //self.emit("alarm", code,action, data[id]['idcamera'] );
			
		    
			}
	  
       
    
	
  });
  self.arrayh=data;
  self.cont=true;
}
  
array_diff(arr1, arr2) {
    var diff = {};

    diff.arr1 = arr1.filter(function(value) {
        if (arr2.indexOf(value) === -1) {
            return value;
        }
    });

    diff.arr2 = arr2.filter(function(value) {
        if (arr1.indexOf(value) === -1) {
            return value;
        }
    });

    diff.concat = diff.arr1.concat(diff.arr2);

    return diff;
};

   
	
	
   
////console.log(array_diff(arr1, arr2));

 
  
    
}

module.exports =davantis

 
 

 

 

