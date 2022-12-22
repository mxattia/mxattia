"use strict";
// provision.js

/*
<config version="1.7" xmlns="http://www.ipc.com/ver10">
    <OpenAlramObj>
        <enum>Motion</enum>
        <enum>Sensor-1</enum>
        <enum>VfdEvent</enum>
    </OpenAlramObj>
    <alarmStatusInfo>
        <motionAlarm type="boolean" id="1">true</motionAlarm>
        <sensorAlarmIn type="list" count="1">
            <itemType type="boolean"/>
            <item id="1">false</item>
        </sensorAlarmIn>
        <perimeterAlarm type="boolean" id="1">false</perimeterAlarm>
        <tripwireAlarm type="boolean" id="1">false</tripwireAlarm>
        <oscAlarm type="boolean" id="1">false</oscAlarm>
        <sceneChange type="boolean" id="1">false</sceneChange>
        <clarityAbnormal type="boolean" id="1">false</clarityAbnormal>
        <colorAbnormal type="boolean" id="1">false</colorAbnormal>
        <cpcAlarm type="boolean" id="1">false</cpcAlarm>
        <ipdAlarm type="boolean" id="1">false</ipdAlarm>
        <cddAlarm type="boolean" id="1">false</cddAlarm>
        <vfdAlarm type="boolean" id="1">false</vfdAlarm>
    </alarmStatusInfo>
</config>

<config version="1.0" xmlns="http://www.ipc.com/ver10">
    <alarmStatusInfo>
        <motionAlarm type="boolean" id="4">true</motionAlarm>
        <motionAlarm type="boolean" id="6">true</motionAlarm>
        <motionAlarm type="boolean" id="16">true</motionAlarm>
        <chlOfflineAlarm type="list" count="12">
            <itemType type="boolean"></itemType>
            <item id="9">true</item>
            <item id="14">true</item>
            <item id="15">true</item>
            <item id="18">true</item>
            <item id="19">true</item>
            <item id="20">true</item>
            <item id="21">true</item>
            <item id="22">true</item>
            <item id="26">true</item>
            <item id="29">true</item>
            <item id="31">true</item>
            <item id="32">true</item>
        </chlOfflineAlarm>
    </alarmStatusInfo>
</config>

http://62.90.161.191:8181/GetAlarmStatus
authorization  basic
username
password
body
<?xml version="1.0" encoding="utf-8" ?>

*/

// Define Globals
var TRACE = true;



var http = require('http'),
    querystring = require('querystring'),
    fs = require('fs') ;
	
var xml2js = require('xml2js');
 var convert = require('xml-js');	
	
 
 var parseString = require('xml2js').parseString;
   
    
	 
//var events = require('events');    
//var util = require('util');	
	
//const EventEmitter = require('events');

//class MyEmitter extends EventEmitter {};

//const myevent = new MyEmitter();	
	
	
const EventEmitter = require( 'events' );	
 

class provision extends EventEmitter {
	
	constructor(options) {
	 super();	
	    
     this.host = options.host;
	 
	  
     this.port=options.port;
     this.user= options.user;
     this.pass= options.pass;
	 
	 
	 
     console.log(options) ;
	 
	 // defaults
    this.settings = {
	  host:	'192.168.1.239',
	  port:	81,
	  user:	'admin',
	  pass:	''
    } 
	 
	 
	
	 this.lastevents='222222';
	 this.starttime = Date.now();
	 this.eventTime='';
	 
	  
	   
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
        
	    
	   
	   _this.interval = setInterval(_this.start1.bind(_this), 5000);
    };
   
    stop(){
          let _this = this; 	  
	      clearInterval(_this.interval )  ;
	      console.log('stop ' );
    };
    
    
  // Adding a method to the constructor
     
	// overrides
    setup( props,cb ) {
		
		cb('Connected');
	 	
	for( var key in props ) {
		this.settings[ key ] = props[ key ]
		 console.log('setup  props'+this.settings[ key ]);
	}
	
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
		path:		'GetAlarmStatus',
		callback:	function( data ) {
			
			var result = {}
			 
			
			var xml = data.toString();
			
		      _this.handleDahuaEventDatax(_this, xml,result,millis); 
			
			return;
			 
			
			
			
			
             
			
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
	
	var auth = 'Basic ' + Buffer.from(props.fields.user + ':' + props.fields.pwd).toString('base64');
	
	var path = '/'+ props.path ; //+'?'+ querystring.stringify( props.fields )
	
	// connect
	var req = http.request({
		
		host:		_this.settings.host,
		port:		_this.settings.port,
		path:		path,
		method:		'POST',
		
		headers: {
        'Content-Type': 'application/json',
        'Authorization': auth
       },
	   body:{
		   //'<?xml version="1.0" encoding="utf-8" ?>',  
		   
	   } 
		
		 
		
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
		_this.stop()
		
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
						throw err
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
	self.emit("connect");
}	

   


handleDahuaEventDatax( self, data,result,millis) {
   //if (TRACE)  console.log('Data: ' + data.toString());
  data = data.toString().split('\n');
  console.log(data.length);
  var i = Object.keys(data);
  i.forEach(function(id){
	 
    if (data[id].indexOf('motionAlarm')>0) {
		  //if (TRACE)  console.log('Data: ' + data[id].toString());
		  //<alarmStatusInfo>
		  var str=data[id].toString().replace("<alarmStatusInfo>", "");
		  var result1 = convert.xml2json(str, {compact: true, spaces: 4});
         
          console.log(result1.toString('utf-8')   );
		   var a=JSON.parse(result1);
		 //if (Array.isArray(a) && a.length) {
		      if (TRACE) console.log(a['motionAlarm']['_attributes']['id']      );
		      if (TRACE) console.log(a['motionAlarm']['_text'] );
			 
			  result['alarm_status']=a['motionAlarm']['_text'] ;
			  result['wcode']=a['motionAlarm']['_attributes']['id'];
			 
			 
			 if( result.alarm_status=='true' ) {
				 if (TRACE) console.log(' result.alarm_status    Event..........: ' + result.alarm_status+' --' +self.lastevents );
				if (self.lastevents==result.alarm_status+result.wcode){
					 millis= ((Date.now() - self.starttime));
					 if ( (Math.floor(millis/1000)<60)) {
						
						 if (TRACE) console.log('    Skipped Event..........: ' + Math.floor(millis/1000 ));
						    return ;	 
						   
					 }else{
						 
						 if (TRACE) console.log('    Skipped Time: ' + Math.floor(millis/1000  ));
						   self.starttime= Date.now(); 
					 }	

                    // return ;					 
					 
				}else{
					  self.lastevents=result.alarm_status+result.wcode ;
					  console.log('not ',self.lastevents);
					 //init time.
					 self.starttime= Date.now();
					 self.eventTime = Date.now() - self.starttime;
					 //console.log("seconds elapsed = " + Math.floor(_this.eventTime/1000)); 
				}
			 
			 }
			 
			 self.emit("alarm", "VideoMotion","Start",a['motionAlarm']['_attributes']['id']);
		    
	    // }
	  
       
    }
  });
}
  
	
 

 
  
    
}

module.exports =provision

 
 

 

 

