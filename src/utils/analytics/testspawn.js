         
 const child = require('child_process');
 const spawn = child.spawn;
 const exec = child.exec;
 
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

 var camera ={
                  cameraType : 'dahua',
                  username : ,
			      password : ,
                  host : ,
                     port : ,
                     AnalyticsChannel : ,
                     custnumber :  ,
                     mokedccode :  ,
                     run : ,
                     ispyaction : },
                     
                     analytics : {
                          connectionType : ,
                          host : ,
                          port :
                     }                          




         
         var analyticsProcess = new spawn('node', ['processor', camera.config.host,camera.config.AnalyticsChannel, camera.config.port, camera.config.username, camera.config.password, camera.config.cameraType,camera.config.custnumber,camera.config.mokedccode, analyticsConfig.host, analyticsConfig.port, analyticsConfig.connectionType,camera.config.run], { stdio: ['pipe'], detached: false });
				   
		 analyticsProcess.stderr.on('data', (data) : {
              console.log('stderr:............'+data  );
			  if (cb) {

                cb('error');
                cb = undefined;
				
				//this.terminateProcess(feed);
				
				
            }