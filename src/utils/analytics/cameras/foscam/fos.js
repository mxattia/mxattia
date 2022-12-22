"use strict";
// foscam.js

// Define Globals
var TRACE = true;

var  globalConfig = require("../../../../config.js");

var http = require('http'),
    querystring = require('querystring'),
    fs = require('fs') ;
 const mkdirp = require('mkdirp') 
 const child = require('child_process');
 const spawn = child.spawn;

 function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
	
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
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
	
	
const EventEmitter = require( 'events' );	
 

class foscam extends EventEmitter {
	
	constructor(options) {
	 super();	
	    
     this.host = options.host;
	 
	  
     this.port=options.port;
     this.user= options.user;
     this.pass= options.pass;
	 
	 
	 
     console.log(options) ;
	 
	 // defaults
    this.settings = {
	  host:	'192.168.2.133',
	  port:	8088,
	  user:	'attia',
	  pass:	'67195a'
    }
	 
	//  
	
	 this.lastevents='222222';
	 this.starttime = Date.now();
	 this.eventTime='';
	 this.counter=1;
	 this.precounter=1;
	 
	 /*
http://192.168.2.133:8088/set_alarm.cgi?
user=attia
&pwd=67195a
&motion_armed=1
&motion_sensitivity=0

&motion_compensation=1
&sounddetect_armed=1
&sounddetect_sensitivity=0
&iolinkage=0&mail=0
&upload_interval=0
&schedule_enable=1
&schedule_sun_0=-1
&schedule_sun_1=-1
&schedule_sun_2=-1
&schedule_mon_0=-1
&schedule_mon_1=-1
&schedule_mon_2=-1
&schedule_tue_0=-1
&schedule_tue_1=-1
&schedule_tue_2=-1
&schedule_wed_0=-1
&schedule_wed_1=-1
&schedule_wed_2=-1
&schedule_thu_0=-1
&schedule_thu_1=-1
&schedule_thu_2=-1
&schedule_fri_0=-1
&schedule_fri_1=-1
&schedule_fri_2=-1
&schedule_sat_0=-1
&schedule_sat_1=-1
&schedule_sat_2=-1

*/
	 
	 
	   this.data = {
	      user:this.settings.user,
		  pwd:this.settings.pass, 
		  next_url:'',
		  motion_armd:'1',
		  motion_sensitivity:'5',
		  motion_compensation:'1',
		  sounddetect_armed:'0',
			sounddetect_sensitivity:'0',
			iolinkage:'0',
			mail:'0',
			upload_interval:'0',
			schedule_enable:'1',
			schedule_sun_0:'-1',
			schedule_sun_1:'-1',
			schedule_sun_2:'-1',
			schedule_mon_0:'-1',
			schedule_mon_1:'-1',
			schedule_mon_2:'-1',
			schedule_tue_0:'-1',
			schedule_tue_1:'-1',
			schedule_tue_2:'-1',
			schedule_wed_0:'-1',
			schedule_wed_1:'-1',
			schedule_wed_2:'-1',
			schedule_thu_0:'-1',
			schedule_thu_1:'-1',
			schedule_thu_2:'-1',
			schedule_fri_0:'-1',
			schedule_fri_1:'-1',
			schedule_fri_2:'-1',
			schedule_sat_0:'-1',
			schedule_sat_1:'-1',
			schedule_sat_2:'-1' 
		  
		  
		};
	 
	   
  }
  
  
  
    
	
	
    start1(){
	     let _this = this; 
	  
        _this.status(function( cb ) {
	       //console.log(cb);
		   
       });

	    
	     console.log('run ' );
           
   }
  
   
    start (){
	    let _this = this; 	  
        
	    
	   
	    _this.interval = setInterval(_this.start1.bind(_this), 2000);
    };
   
    stop(){
          let _this = this; 	  
	      clearInterval(_this.interval )  ;
	      //console.log('stop ' );
		   _this.emit("close",'close');
		  
		  
    };
    
    
  // Adding a method to the constructor
     
	// overrides
    setup( props,cb ) {
		
		//cb('Connected');
		//-----
		
		
		 
	 	
	for( var key in props ) {
		this.settings[ key ] = props[ key ]
		 //console.log('setup  props'+this.settings[ key ]);
	}
	
	
	 this.setalarm(  this.data );
	 this.arm('1',console.log);
		 
	
	
	
	if( typeof cb == 'function' ) {
		 
		 this.status( cb )
		  
		 
	}
   }
	
	
   //---
    // status
    status ( cb ) {
	let _this = this;
    let	millis=0;
	this.talk({
		path:		'get_status.cgi',
		callback:	function( data ) {
			var result = {}
			
			data = data.split('\n')
			for( var d in data ) {
				if( data[d] != '' ) {
					var line = data[d].split('var ')
					line = String(line[1]).split('=')
					line[1] = String(line[1]).replace( /;$/, '' )
					result[ line[0] ] = line[1].substr(0,1) == '\'' ? line[1].substr(1, line[1].length -2) : line[1]
				}
			}
			 
			if( result.alarm_status ) {
				 if (TRACE) console.log(' result.alarm_status    Event..xxxx..: ' + result.alarm_status+' --' +_this.lastevents );
				if (_this.lastevents==result.alarm_status){
					 millis= ((Date.now() - _this.starttime));
					 if ( (Math.floor(millis/1000)<60)) {
						 
						  
						 
						 
						 
                          //try 
						  //{						  
						  //var id=fs.openSync(dest+"/"+fname, 'w');
						  //fs.unlinkSync(dest+"/"+fname);
						  //fs.closeSync( id);
						 // }catch(error)  {
						  
					      //}
						  console.log('remove'+result.alarm_status.toString().trim()); 
						  
						  /*
						  fs.stat(dest+"/"+fname, function (err, stats) {
							   //console.log(stats);//here we got all information of file in stats variable
                               
							   if (err) {
								   return ; //console.error(err);
							   }
                                fs.closeSync(fs.openSync(dest+"/"+fname, 'w'));
							    fs.unlinkSync(dest+"/"+fname);
								 fs.closeSync(fs.openSync(dest+"/"+fname, 'w'));
								console.log('remove'); 
						  });
						*/		
                           
                        
						  
						  
						  if (result.alarm_status.toString().trim()=='1'){
							   _this.counter++;
						  if (_this.counter>50){
							  
							  _this.counter=1; 
						  }
						
						  var TimeStamp='collect'; //createTimeStamp() ;	
		           
						  var host  = _this.settings.host.split('.').join("");
						  var gdest=dest= globalConfig.default.recording.locationPath+'/'+_this.settings.mokedccode+"/"+host+_this.settings.port+'1'+"/"+ TimeStamp  ;
						  //console.log(dest);
						    mkdirp.sync(dest) ;  
						  
						 //ffmpeg -f image2 -i  image%3d.jpeg test.mp4
						  var fname='image'+  pad(_this.counter, 3).toString().trim()+'.jpeg';
							   
							  
							  _this.snapshot (dest+"/"+fname, function(cb){	 
			  
							           //create file ..in collect path imagexxx.jpeg 
			 
						     }) ;
						  }	 
						 
						  if (result.alarm_status.toString().trim()=='0'){
							   _this.precounter++;
						  if (_this.precounter>50){
							  
							  _this.precounter=1; 
						  }
						
						  var TimeStamp='collect'; //createTimeStamp() ;	
		           
						  var host  = _this.settings.host.split('.').join("");
						  var gdest=dest= globalConfig.default.recording.locationPath+'/'+_this.settings.mokedccode+"/"+host+_this.settings.port+'1'+"/"+ TimeStamp  ;
						  //console.log(dest);
						    mkdirp.sync(dest) ;  
						  
						 //ffmpeg -f image2 -i  image%3d.jpeg test.mp4
						  var fname='preimage'+  pad(_this.precounter, 3).toString().trim()+'.jpeg';
							   
							  
							  _this.snapshot (dest+"/"+fname, function(cb){	 
			  
							           //create file ..in collect path imagexxx.jpeg 
			 
						     }) ;
						  }	 	  
							 
							
						      
						   
						    
						   
							  
						
						
						  
						 //ffmpeg -framerate 10 -i image%3d.jpeg -err_detect ignore_err -r 5 -y test.mp4
						 /*
							 	var ffmpegString='-framerate 10 -i '+dest+'/image%3d.jpeg -err_detect ignore_err -r 5 -y '+dest+'/test1.mov';
						   		console.log(ffmpegString.split(' '));
							 	var ffmpeg = new spawn('ffmpeg', ffmpegString.split(' '));
						
						        ffmpeg.stderr.on('data', (data) => {
                                     console.log(`${data}`);
                                 });
						*/
						
						
						 if (TRACE) console.log('    Skipped Event..........: ' + Math.floor(millis/1000 ));
						 
						    return ;	 
						   
					 }else{
						 
						 if (TRACE) console.log('    Skipped Time: ' + Math.floor(millis/1000  ));
						   _this.starttime= Date.now(); 
					 }	

                    // return ;					 
					 
				}else{
					  _this.lastevents=result.alarm_status ;
					
					 //init time.
					 _this.starttime= Date.now();
					 _this.eventTime = Date.now() - _this.starttime;
					 //console.log("seconds elapsed = " + Math.floor(_this.eventTime/1000)); 
				}
				 
				
				switch( result.alarm_status ) {
					case '0': result.alarm_status_str = 'no alarm'; 
					     _this.emit("alarm", "VideoMotion","Stop","1");
					break
					case '1': result.alarm_status_str = 'motion alarm';
					
					
					     var TimeStamp=createTimeStamp() ;	
		           
						  var host  = _this.settings.host.split('.').join("");
						  var dest= globalConfig.default.recording.locationPath+'/'+_this.settings.mokedccode+"/"+host+_this.settings.port+'1'+"/"+ TimeStamp  ;
						  var gdest=globalConfig.default.recording.locationPath+'/'+_this.settings.mokedccode+"/"+host+_this.settings.port+'1'+"/collect" ; 
						  console.log(dest);
						  var fname='1snap.jpeg'; 
						  mkdirp.sync(dest) ;
						   
						  _this.snapshot (dest+"/"+fname, function(cb){	 
			  
							    console.log('events...');
							   //----collect all jpeg  to mp4 and run py 1x.py
							    //ffmpeg -framerate 10 -i i*%3d.jpeg -r 1 -y  1snap.mp4
							    //ffmpeg -framerate 1 -i  image%3d.jpeg  -err_detect ignore_err -r 1 -y  1snap.mp4
								 var fnamea=fname.split('.');
								  
								 var ffmpegString='-framerate 10 -i '+gdest+'/image%3d.jpeg -err_detect ignore_err -r 1 -y '+dest+'/'+fnamea['0']+'.mp4';
						   		 console.log(ffmpegString.split(' '));
							 	 var ffmpeg = new spawn('ffmpeg', ffmpegString.split(' '));
						
						         ffmpeg.stderr.on('data', (data) => {
                                     console.log(`${data}`);
                                 });
								
								
								
								
								
							   
							   
			 
						  });
				   
					  
					
                         _this.emit("alarm", "VideoMotion","Start","1");
						 
					break
					case '2': result.alarm_status_str = 'input alarm';
					    _this.emit("alarm", "input alarm","Start","1");

					break
				}
			}
			
			if( result.ddns_status ) {
				//this.emit("alarm", result.ddns_status,"Start","1");
				switch( result.ddns_status ) {
					case '0': result.ddns_status_str = 'No Action'; break
					case '1': result.ddns_status_str = 'It\'s connecting...'; break
					case '2': result.ddns_status_str = 'Can\'t connect to the Server'; break
					case '3': result.ddns_status_str = 'Dyndns Succeed'; break
					case '4': result.ddns_status_str = 'DynDns Failed: Dyndns.org Server Error'; break
					case '5': result.ddns_status_str = 'DynDns Failed: Incorrect User or Password'; break
					case '6': result.ddns_status_str = 'DynDns Failed: Need Credited User'; break
					case '7': result.ddns_status_str = 'DynDns Failed: Illegal Host Format'; break
					case '8': result.ddns_status_str = 'DynDns Failed: The Host Does not Exist'; break
					case '9': result.ddns_status_str = 'DynDns Failed: The Host Does not Belong to You'; break
					case '10': result.ddns_status_str = 'DynDns Failed: Too Many or Too Few Hosts'; break
					case '11': result.ddns_status_str = 'DynDns Failed: The Host is Blocked for Abusing'; break
					case '12': result.ddns_status_str = 'DynDns Failed: Bad Reply from Server'; break
					case '13': result.ddns_status_str = 'DynDns Failed: Bad Reply from Server'; break
					case '14': result.ddns_status_str = 'Oray Failed: Bad Reply from Server'; break
					case '15': result.ddns_status_str = 'Oray Failed: Incorrect User or Password'; break
					case '16': result.ddns_status_str = 'Oray Failed: Incorrect Hostname'; break
					case '17': result.ddns_status_str = 'Oray Succeed'; break
					case '18': result.ddns_status_str = 'Reserved'; break
					case '19': result.ddns_status_str = 'Reserved'; break
					case '20': result.ddns_status_str = 'Reserved'; break
					case '21': result.ddns_status_str = 'Reserved'; break
				}
			}
			
			if( result.upnp_status ) {
				switch( result.upnp_status ) {
					case '0': result.upnp_status_str = 'No Action'; break
					case '1': result.upnp_status_str = 'Succeed'; break
					case '2': result.upnp_status_str = 'Device System Error'; break
					case '3': result.upnp_status_str = 'Errors in Network Communication'; break
					case '4': result.upnp_status_str = 'Errors in Chat with UPnP Device'; break
					case '5': result.upnp_status_str = 'Rejected by UPnP Device, Maybe Port Conflict'; break
				}
			}
			
			cb(result )
		}
	})
}
   
	
	
	//----
	// communicate
   talk ( props ) {
	let _this = this;	
	if( !props.fields ) {
		props.fields = {}
	}
	
	props.fields.user = _this.settings.user
	props.fields.pwd = _this.settings.pass
	var path = '/'+ props.path +'?'+ querystring.stringify( props.fields )
	
	// connect
	var req = http.request({
		
		host:		_this.settings.host,
		port:		_this.settings.port,
		path:		path,
		method:		'GET'
		
	}, function( response ) {
		
		// response
		response.setEncoding( props.encoding ? props.encoding : 'utf8' )
		var data = ''
		
		
		 
		
		
		
		response.on( 'data', function( chunk )
		{ 
		     
		    _this.handleConnection(_this, _this.settings);
		   
		   data += chunk ;
		    
		})
		response.on( 'end', function() {
			 // console.log('........end..'+data );
			 
			 _this.emit('end');
			if( typeof props.callback == 'function' ) {
				data = data.trim()
				 props.callback( data )
			}
			
		})
		
	})
	
	// fail
	req.on( 'error', function( err ) {
		//error connection to camera
		
		_this.emit( 'error', err );
		_this.stop();
		
	})
	
	// disconnect
	  req.end()
	
}
//--------------------------
// camera params
 camera_params ( cb ) {
	this.talk({
		path:		'get_camera_params.cgi',
		callback:	function( data ) {
			var result = {}
			data.replace( /var ([^=]+)=([^;]+);/g, function( str, key, value ) {
				result[ key ] = parseInt( value )
			})
			cb( result )
		}
	})
 }


//-------------------------------------


// reboot
 reboot  ( cb ) {
	this.talk({
		path:		'reboot.cgi',
		callback:	cb
	})
}


// restore factory
 restore_factory ( cb ) {
	this.talk({
		path:		'restore_factory.cgi',
		callback:	cb
	})
}


// params
 params  ( cb ) {
	this.talk({
		path:		'get_params.cgi',
		callback:	cb
	})
}

/*


*/
 

arm  (arm, cb) {
	 
     this.talk ({
      path: 'set_alarm.cgi',
      fields: { motion_armed: arm },
      callback: cb
    });
  }  


setalarm(key){
	
/*
http://192.168.2.133:8088/set_alarm.cgi?user=attia&pwd=67195a&motion_armed=1&motion_sensitivity=0&motion_compensation=1&sounddetect_armed=1&sounddetect_sensitivity=0&iolinkage=0&mail=0&upload_interval=0&schedule_enable=1&schedule_sun_0=-1&schedule_sun_1=-1&schedule_sun_2=-1&schedule_mon_0=-1&schedule_mon_1=-1&schedule_mon_2=-1&schedule_tue_0=-1&schedule_tue_1=-1&schedule_tue_2=-1&schedule_wed_0=-1&schedule_wed_1=-1&schedule_wed_2=-1&schedule_thu_0=-1&schedule_thu_1=-1&schedule_thu_2=-1&schedule_fri_0=-1&schedule_fri_1=-1&schedule_fri_2=-1&schedule_sat_0=-1&schedule_sat_1=-1&schedule_sat_2=-1

*/	
	
 let _this = this;	
	 
 var searchParams = querystring.stringify(key);

  
     
	var path = '/set_alarm.cgi?'+searchParams;
	 console.log('...................'+path);
	// connect
	var req = http.request({
		
		host:		_this.host,
		port:		_this.port,
		path:		path,
		 
		method: 'GET',
						forever: true ,
						timeout:0,
		
		
		
		
	}, function( response ) {
		
		// response
		 console.log('response...........' );



		
		var data = ''
		
		response.on( 'data', function( chunk )
		{ 
		     
		  //console.log('........DATA..'+chunk); 
           console.log('connect....................................after emit ' );		  
		   _this.emit("connect",'on');

           if (chunk.indexOf('Unauthorized')>0){
			   _this.stop() ;
			  //quit
		   }
		  
		    
		})
		response.on( 'end', function(a) {
			   //console.log('........end..',a );
			 
			  
			
		})
			
	 
	
	
})


// fail
	req.on( 'error', function( err ) {
		//error connection to camera
		//console.log('.erererrrr..',err );
		 
		
		_this.emit( 'error', err );
		_this.stop();
		
		
	})

// disconnect
	  req.end()
       
}
// set
 
	
	// alias
	alias ( alias, cb ) {
		this.talk({
			path:		'set_alias.cgi',
			fields:		{ alias: alias },
			callback:	cb
		})
	} 
	
	// datetime
	datetime ( props, cb ) {
		this.talk({
			path:		'set_datetime.cgi',
			fields:		props,
			callback:	cb
		})
	}
	
 


// snapshot
 snapshot  ( filepath, cb ) {
	if( !cb && typeof filepath == 'function' ) {
		var cb = filepath
		var filepath = false
	}
	
	this.talk({
		path:		'snapshot.cgi',
		encoding:	'binary',
		callback:	function( bin ) {
			if( filepath ) {
				 
				fs.writeFile( filepath, bin, 'binary', function( err ) {
					if( err ) {
						console.log('snap err'+err);
						//throw err
						cb( false )
					} else {
						 
						cb( filepath )
					}
				})
				
				
				 
                  
				
				
				
				
			} else {
				cb( bin )
			}
		}
	})
}
  
  
 
//----------------

// control
 
	
	// pan/tilt
	decoder ( cmd, cb ) {
		
		if( typeof cmd == 'string' && !cmd.match( /^[0-9]+$/ ) ) {
			switch( cmd ) {
				case 'up':                      cmd = 0; break
				case 'stop up':                 cmd = 1; break
				case 'down':                    cmd = 2; break
				case 'stop down':               cmd = 3; break
				case 'left':                    cmd = 4; break
				case 'stop left':               cmd = 5; break
				case 'right':                   cmd = 6; break
				case 'stop right':              cmd = 7; break
				case 'center':                  cmd = 25; break
				case 'vertical patrol':         cmd = 26; break
				case 'stop vertical patrol':    cmd = 27; break
				case 'horizontal patrol':       cmd = 28; break
				case 'stop horizontal patrol':  cmd = 29; break
				case 'io output high':          cmd = 94; break
				case 'io output low':           cmd = 95; break
			}
		}
		
		this.talk({
			path:		'decoder_control.cgi',
			fields:		{ command: cmd ,onestep:1500},
			callback:	cb
		})
	} 
	
	// camera settings
	camera ( param, value, cb ) {
		
		// fix param
		if( typeof param == 'string' && !param.match( /^[0-9]+$/ ) ) {
			switch( param ) {
				
				case 'brightness':         param = 1; break
				case 'contrast':           param = 2; break
				
				// resolution
				case 'resolution':
					param = 0
					if( typeof value == 'string' && !value.match( /^[0-9]{1,2}$/ ) ) {
						switch( value ) {
							case '320':
							case '320x240':
							case '320*240':
								value = 8
								break
								
							case '640':
							case '640x480':
							case '640*480':
								value = 32
								break
						}
					}
					break
				
				case 'mode':
					param = 3
					if( typeof value == 'string' && !value.match( /^[0-9]$/ ) ) {
						switch( value.toLowerCase() ) {
							case '50':
							case '50hz':
							case '50 hz':
								value = 0
								break
								
							case '60':
							case '60hz':
							case '60 hz':
								value = 1
								break
								
							case 'outdoor':
							case 'outside':
								value = 2
								break
						}
					}
					break
					
				case 'flipmirror':
					param = 5
					if( typeof value == 'string' && !value.match( /^[0-9]$/ ) ) {
						switch( value.toLowerCase() ) {
							case 'default':
								value = 0
								break
								
							case 'flip':
								value = 1
								break
								
							case 'mirror':
								value = 2
								break
								
							case 'flipmirror':
							case 'flip&mirror':
							case 'flip+mirror':
							case 'flip + mirror':
							case 'flip & mirror':
								value = 3
								break
						}
					}
					break
			}
		}
		
		// send it
		this.talk({
			path:		'camera_control.cgi',
			fields: {
				param:	param,
				value:	value
			},
			callback:	cb
		})
		
	}
	
// Handle connection
 handleConnection(self, options) {
	if (TRACE) console.log('Connected to ' + options.host+":" +options.port)
	//self.socket = socket;
	 
	 //self.emit("connect",'on');
}	


	  
						 
	
 

 
  
    
}

module.exports =foscam

 
 

 

 

