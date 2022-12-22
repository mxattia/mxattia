var     ipcamera	=  require('./cameras/dahuatest/index.js') ;

// Options:
var optionsX = {
	host	: '195.192.231.79',
	port 	: '9091',
	user 	: 'admin',
	pass 	: 'shani2022',
	log 	: false,
    mokedccode:'1054'
};


//* 147.235.49.234:8090 admin BeniAvitan123*//

var options1 = {
	host	: '147.235.49.234',
	port 	: '8090',
	user 	: 'admin',
	pass 	: 'BeniAvitan123',
	log 	: false,
    mokedccode:'1054'
};



var options2 = {
	host	: '37.142.115.48',
	port 	: '90',
	user 	: 'admin',
	pass 	: 'a1234',
	log 	: false,
    mokedccode:'80000'
};
 
var options = {
	host	: '37.142.115.48',
	port 	: '90',
	user 	: 'admin',
	pass 	: 'a1234',
	log 	: false,
    mokedccode:'80000' 
    
}; 
 
 



var dahua 	= new ipcamera.dahua(optionsX );

// Switch to Day Profile
//dahua.nightProfile()

// PTZ Go to preset 10
//dahua.ptzPreset(10)

// Monitor Camera Alarms
dahua.on('alarm', function(code,action,index) {
	if (code === 'VideoMotion' && action === 'Start')	console.log('Video Motion Detected')
	if (code === 'VideoMotion' && action === 'Stop')	console.log('Video Motion Ended')
	if (code === 'AlarmLocal' && action === 'Start')	console.log('Local Alarm Triggered: ' + index)
	if (code === 'AlarmLocal' && action === 'Stop')		console.log('Local Alarm Ended: ' + index)
	if (code === 'VideoLoss' && action === 'Start')		console.log('Video Lost!')
	if (code === 'VideoLoss' && action === 'Stop')		console.log('Video Found!')
	if (code === 'VideoBlind' && action === 'Start')	console.log('Video Blind!')
	if (code === 'VideoBlind' && action === 'Stop')		console.log('Video Unblind!')
});
/*
// Find Files
var query = {
  'channel': '0',
  'startTime': '2018-5-9 09:00:00',
  'endTime': '2018-5-9 12:00:00',
  'types': ['jpg','dav'], // [ “dav”, “jpg”, “mp4” ]
  'count': 10 // max. 100
};

dahua.findFiles(query);
dahua.on('filesFound',function(data){
  console.log('filesFound:', data);
});

// Save File
var fileMeta = { 
       Channel: '0',
       EndTime: '2018-05-19 10:45:00',
       FilePath: '/mnt/sd/2018-05-19/001/dav/10/10.36.45-10.45.00[R][0@0][0].dav',
       StartTime: '2018-05-19 10:36:45',
       Type: 'dav'
};

dahua.saveFile(fileMeta);
dahua.on('saveFile',function( msg ){
  console.log('File saved!');
});

// Get a snapshot
dahua.getSnapshot();
dahua.on('getSnapshot',function( msg ){
  console.log(msg);
});

 
// Switch Camera to Night Profile
dahua.dayProfile()

// Switch Camera to Night Profile
dahua.nightProfile()

// Issue Dahua RAW PTZ Command (See API Manual in GitHub Wiki)
dahua.ptzCommand(cmd,arg1,arg2,arg3,arg4)

// Go To Preset
dahua.ptzPreset(int)

// PTZ Zoom, input level: positive = zoom in / negative = zoom out
dahua.ptzZoom(float)

// PTZ Move
// Directions = Up/Down/Left/Right/LeftUp/RightUp/LeftDown/RightDown
// Actions = start/stop
// Speed = 1-8
dahua.ptzMove(direction,action,speed)

// Request current PTZ Status
dahua.ptzStatus()

// Find files
var query = {
  'channel': '0',
  'startTime': '2018-5-9 09:00:00',
  'endTime': '2018-5-9 12:00:00',
  'types': ['jpg','dav'], // [ “dav”, “jpg”, “mp4” ] - optional
  'count': 10 // max. 100 - optional
};
dahua.findFiles(query)

// Callback for file search results
dahua.on('filesFound',function(data){
  console.log('filesFound:', data);
});

// Save file
// requires a the following options for filename creation
// attributes equal findFile results object structure
var fileMeta = { 
       Channel: '0',
       EndTime: '2018-05-19 10:45:00',
       FilePath: '/mnt/sd/2018-05-19/001/dav/10/10.36.45-10.45.00[R][0@0][0].dav',
       StartTime: '2018-05-19 10:36:45',
       Type: 'dav'
};
dahua.saveFile(fileMeta);

// Callback for file saved
dahua.on('saveFile',function( msg ){
  console.log('File saved!');
});

// Get a snapshot
var options = {
  'path': 'snaps', // optinal, where to save the file
  'channel':'', // optional, defaults to 0,
  'filename' : '', // optional, defaults to [HOST]_ch[channel]_[TIMESTAMP]
};
  
dahua.getSnapshot();
dahua.on('getSnapshot',function( msg ){
  console.log(msg);
});

// Callback for any Alarm (Motion Detection/Video Loss & Blank/Alarm Inputs)
dahua.on('alarm', function(code,action,index){  });

// Callback for PTZ Status
dahua.on('ptzStatus', function(data){  });

// Callback on connect
dahua.on('connect', function(){  });

// Callback on error
dahua.on('error', function(error){  });
*/