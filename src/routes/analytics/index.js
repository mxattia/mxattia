import express from 'express';
const log = require('node-pretty-log');
import Analytics from '../../models/analytics';
import Camera from '../../models/camera';
import config from "../../config";
const request = require('request');

let router = express.Router();
const AnalyticsManager = new Analytics();

const prepareObjects = function (req, res, next) {
	try {
		//log('warn', "Preparing Objects - Start...........");
		const { camera, analytics, period } = req.body;
		const configCamera = {
			username: camera.username ? camera.username : '',
			password: camera.password ? camera.password : '',
			host: camera.host ? camera.host : '',
			AnalyticsChannel: camera.AnalyticsChannel ? camera.AnalyticsChannel : '1',
			port: camera.port ? camera.port : '80',
			cameraType: camera.cameraType ? camera.cameraType : '',
			custnumber: camera.custnumber ? camera.custnumber : ''  ,
			mokedccode: camera.mokedccode ? camera.mokedccode : '' ,
			run:camera.run ? camera.run : '' ,
            rtspport:camera.rtspport ? camera.rtspport :'554',
			
			
			channel: 'analytics'
		};

		const analyticsConfig = {
			host: analytics.host ? analytics.host : '',
			port: analytics.port ? analytics.port : '',
			connectionType: analytics.connectionType ? analytics.connectionType : '',
			period: period || config.analytics.defaultAnalyticsTime
		};
		const CameraInstance = new Camera(configCamera);
		req.CameraInstance = CameraInstance;
		req.analyticsConfig = analyticsConfig;
		//log('warn', "Preparing Objects - Done");
		next();
	} catch (e) {

		next();
	}
}

/**
 * {
	"camera":{
		"username":"admin",
		"password":"hvi12345",
		"host":"141.226.193.227",
		"port":"80"
	},
	"analytics":{
		"connectionType":"TCP",
		"host":"127.0.0.1",
		"port":"7070"
	}
	
}
 */
router.post('/startAnalytics', prepareObjects, function (req, res) {
	//console.log(req.CameraInstance);
	//console.log(req.analyticsConfig);
	AnalyticsManager.startAnalytics(req.CameraInstance.getFeedId(), req.CameraInstance, req.analyticsConfig, function (data) {
		res.json({});
	});
});
/**
 * {
	"data": [
		{
			"camera":
			{
				"username":"admin",
				"password":"hvi12345",
				"host":"141.226.193.227",
				"port":"80"
			},
			"analytics":{
				"connectionType":"TCP",
				"host":"127.0.0.1",
				"port":"7070"
			}
		}
		
	]
}
 */
router.post('/startAnalyticsBatch', function (req, res) {
	let {apikey}=req.headers;
	//console.log('apikey....'+apikey);
	// look at database if key exist.  
	
	 let { data } = req.body;
	 var  retanswer='body:err';
	if (data==undefined){
		  //res.json( retanswer );
		  //	 return;
	}
	 
	/// console.log(data);
	 let camerasStatus = {};
	data.map((item) => {
		const { camera, analytics, period } = item;
	
	//console.log(' begin username.....'+ camera.username);
	//console.log(' begin.password....'+ camera.password);
	//console.log(' begin.host....'+ camera.host);
	//console.log(' begin.AnalyticsChannel....'+ camera.AnalyticsChannel);
	  console.log('...................... begin.rtspport....'+ camera.rtspport);
	//console.log(' begin.cameraType....'+ camera.cameraType);
	//console.log(' begin.custnumber....'+ camera.custnumber);
	//console.log(' begin.mokedccode....'+ camera.mokedccode);
	//console.log(' begin.run....'+ camera.run);
	 
	 
	    
		
		const configCamera = {
			username: camera.username ? camera.username : '',
			password: camera.password ? camera.password : '',
			host: camera.host ? camera.host : '',
			AnalyticsChannel: camera.AnalyticsChannel ? camera.AnalyticsChannel : '1',
			port: camera.port ? camera.port : '80',
			cameraType: camera.cameraType ? camera.cameraType : '',
			custnumber: camera.custnumber ?  camera.custnumber : '00000',
			mokedccode: camera.mokedccode ?  camera.mokedccode : '00000',
			run: camera.run ?   camera.run : '',
			channel: 'analytics' ,
            rtspport: camera.rtspport ? camera.rtspport :'1554',
		};
	 
	 
	 
	   const analyticsConfig = {
			host: analytics.host ? analytics.host : '',
			port: analytics.port ? analytics.port : '',
			connectionType: analytics.connectionType ? analytics.connectionType : '',
			period: period || config.analytics.defaultAnalyticsTime

		};
	 
		
		
		 
		
		
		

        //console.log('configCamera....',configCamera);
	    log('info', 'configCamera.startAnalytics..........',configCamera);
        const CameraInstance = new Camera(configCamera);
		AnalyticsManager.startAnalytics(CameraInstance.getFeedId(), CameraInstance, analyticsConfig, function (data) {
			console.log('startAnalyticsBatch  '+data);
			 //retanswer='body:err';
             res.json(data);
		});	

       
		});	 
		 
		 
       
	 
	

});


router.post('/startAnalyticsBatchP', async function (req, res) {
	
	//req.setTimeout(0) // no timeout
	let {apikey}=req.headers;
	console.log('apikey....'+apikey);
	// look at database if key exist.  
	
	
	let { data } = req.body;
	var  retanswer='body:err';
	if (data==undefined){
		  res.json( retanswer );
			return;
	}
	 
	 console.log(data);
	 let camerasStatus = {};
	 let cameraIndex = 1;
	 for (const item of data) {
 
	
		const { camera, analytics, period } = item;
	
	    //console.log(' begin username.....'+ camera.username);
	    //console.log(' begin.password....'+ camera.password);
	    //console.log(' begin.host....'+ camera.host);
		//console.log(' begin.AnalyticsChannel.PP...'+ camera.AnalyticsChannel);
		 
	    //console.log(' begin.port....'+ camera.port);
	    //console.log(' begin.cameraType....'+ camera.cameraType);
		//console.log(' begin.custnumber....'+ camera.custnumber);
	    //console.log(' begin.mokedccode....'+ camera.mokedccode);
		
	    //console.log(' begin.run....'+ camera.run);
	 
	 
	   const configCamera = {
			username: camera.username ? camera.username : '',
			password: camera.password ? camera.password : '',
			host: camera.host ? camera.host : '',
			AnalyticsChannel: camera.AnalyticsChannel ? camera.AnalyticsChannel : '1',
			port: camera.port ? camera.port : '80',
			cameraType: camera.cameraType ? camera.cameraType : '',
			custnumber: camera.custnumber ?  camera.custnumber : '00000',
			mokedccode: camera.mokedccode ?  camera.mokedccode : '00000',
			run: camera.run ?   camera.run : 'start',
			channel: 'analytics' 
		};
	  
		
		
		const analyticsConfig = {
			host: analytics.host ? analytics.host : '',
			port: analytics.port ? analytics.port : '',
			connectionType: analytics.connectionType ? analytics.connectionType : '',
			period: period || config.analytics.defaultAnalyticsTime

		};
		
		
		
		

        
        const CameraInstance = new Camera(configCamera);
		//await
		let result =       AnalyticsManager.startAnalyticsPromise(CameraInstance.getFeedId(), CameraInstance, analyticsConfig );
			 
		  
		console.log('return from promis ',CameraInstance.getFeedId(), result);
		camerasStatus[CameraInstance.getFeedId()+cameraIndex] = result;
		cameraIndex++;
       
		}	 
		 
		res.json(camerasStatus); 
       

});


 

 const globalAnalyticsManagerMessageHandler = AnalyticsManager.getGlobalEventHandler();
 globalAnalyticsManagerMessageHandler.on("ANALYTICS_MANAGER", (data) => {
	 log('info', data);

 });

export default router;