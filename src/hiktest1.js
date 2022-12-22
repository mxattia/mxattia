var     ipcamera	= require('./utils/analytics/cameras/hikvision');
//C:\jsmkd\rtsp-15-min\src\utils\analytics\cameras\hikvision
 

// Options: '82.81.212.72'   84.94.105.109, 80.179.200.98:90  a1234567,admin, 194.90.217.106 admin polar

console.log(process.argv);

var options = {
	host: process.argv[2] || '81.218.25.50',
	port: process.argv[3] || '80',
	user: process.argv[4] || 'admin',
	pass: process.argv[5] || 'hvi12345',
	log: true 
};


 


var options3 = {
	host	: '82.102.184.210',
	port 	: '90',
	user 	: 'admin',
	pass 	: 'hvi12345',
	log 	: true,
};


var options2 = {
	host	: '84.94.105.109',
	port 	: '90',
	user 	: 'moked',
	pass 	: 'moked123',
	log 	: false,
};

var options1 = {
	host	: '194.90.217.106',
	port 	: '80',
	user 	: 'admin',
	pass 	: 'polar',
	log 	: true,
};

var options4 = {
	host	: '81.218.25.50',
	port 	: '80',
	user 	: 'admin',
	pass 	: 'hvi12345',
	log 	: false,
};




var hikvision 	= new ipcamera.hikvision(options3);

// Switch to Day Profile
 //hikvision.nightProfile()

// PTZ Go to preset 10
//hikvision.ptzPreset(10)

// Monitor Camera Alarms
hikvision.on('alarm', function(code,action,index) {
	console.log('alarm................  '+code)
	if (code === 'VideoMotion' && action === 'Start')	console.log('Video Motion Detected')
	if (code === 'VideoMotion' && action === 'Stop')	console.log('Video Motion Ended')
	if (code === 'AlarmLocal' && action === 'Start')	console.log('Local Alarm Triggered: ' + index)
	if (code === 'AlarmLocal' && action === 'Stop')		console.log('Local Alarm Ended: ' + index)
	if (code === 'VideoLoss' && action === 'Start')		console.log('Video Lost!...')
	if (code === 'VideoLoss' && action === 'Stop')		console.log('Video Found!....')
	if (code === 'VideoBlind' && action === 'Start')	console.log('Video Blind!')
	if (code === 'VideoBlind' && action === 'Stop')		console.log('Video Unblind!')
});



process.on('uncaughtException',function(error){
	//console.log('sssss'+error);
});




