const shell = require('shelljs');
const child = require('child_process');
const spawn = child.spawn;
import config from '../config';
var ffmpegx = require('fluent-ffmpeg');
var fs = require('fs');

function recordsHandler(req, res, next) {
	if (!config.recording.processStreamFiles) {
		console.log('processStreamFiles:', config.recording.processStreamFiles+ "  "+req.path.toString());
		next();
		return;
	}
	let pathString = req.path.toString();
	 
	if (pathString.indexOf('.stream') > -1) {
        console.log('begin  processing.......'+pathString);  
		pathString = req.path.toString().split('.')[0];
		let inputFile = './records' + req.path.toString();
		let outputFile = './records' + pathString + config.recording.defaultExtension;
		//--
		if  (fs.exists(inputFile , function (exists) {
			 if(exists){
				 
				     new ffmpegx(inputFile)
								.withVideoCodec('libx264')
								 .withSize('320x200')
								 .format('flv')
								.on('error', function(err) {
									console.log('An error occurred: ' + err.message);
								})
								.on('end', function() {
									console.log('Processing finished !');
									req.url = '/records' + pathString + config.recording.defaultExtension;
				                    res.redirect('/records/' + pathString + config.recording.defaultExtension);
									
									
									
								})
								.saveToFile(outputFile);		
				 
				 
				 
				 
				 
				 
				 
				 
				 
				 
				 
				     /*
				 
		             ffmpegx(inputFile).videoCodec('libx264').size('320x200').format('flv').save(outputFile).on('end', function() {
                     console.log('Finished processing.......');
					 req.url = '/records' + pathString + config.recording.defaultExtension;
				     res.redirect('/records/' + pathString + config.recording.defaultExtension);
				         	  
												 
                     });
					 */
			 }
	    }));					  
		
		//--
		//var convertString = "-i " + inputFile + " -b:v 512k -c:v libx264 -preset ultrafast -y " + outputFile;
		//if (config.ffmpeg.showOutput) {
		//	console.log("Converting: ", convertString);
		//}
		//if (process.env.NODE_ENV == "production") {
		//	var conversionProcess = spawn('/bin/bash', ['scripts/convert-mpeg-view.sh', convertString, inputFile], { detached: true });
		//	conversionProcess.on('close', function () {
		//		// 
		//		req.url = '/records' + pathString + config.recording.defaultExtension;
		//		res.redirect('/records/' + pathString + config.recording.defaultExtension);
		//		next();
		//	});

		//} else {
		//	let conv = shell.exec('convert-mpeg-view.sh "' + convertString + '" ' + inputFile, function (code, stdout, stderr) {
		//		if (config.ffmpeg.showOutput) {
		//			console.log('Exit code:', code);
		//			console.log('Program output:', stdout);
		//			console.log('Program stderr:', stderr);
		//		}
				
		//	});


		}
	  else {
		next();
	}

}


export {
	recordsHandler
};