import express from 'express';
import config from "../../config";
const readFiles = require("../../utils/file-api");

let router = express.Router();





function checkFiles(file, stats) {
    // `file` is the path to the file, and `stats` is an `fs.Stats`
    // object returned from `fs.lstat()`.
    console.log(stats);
    return true;
}
 router.get('/getRecords', function (req, res) {
	//router.get(config.recording.locationPath, function (req, res) {
    let listOfFiles = [];
    //readFiles("records/", function (err, files) {
	readFiles( config.recording.locationPath , function (err, files) {	
		
		if (files==undefined){
			
			res.json({records:listOfFiles});
			return ;
		}
		if (err){
			
			  res.json({records:listOfFiles});
			  return ;
		}
		
		
		if( files.length > 1 ) { 	
        files = files.sort((a, b)=>{
			return new Date(b.creationTime) - new Date(a.creationTime);
		});
		}
		// `files` is an array of file paths
		listOfFiles = files.map((item)=>{
			return item.filePath.replace(/\\/g, '/');
		});
        res.json({records:listOfFiles});
		//res.json({ listOfFiles});
    });

});
router.get('/getRecordsByCustomer', function (req, res) {
	let customer = req.query.customer;
    let listOfFiles = [];
    readFiles(config.recording.locationPath , function (err, files) {
		//console.log(err+' ERR AND FILES '+files); 
		if (files==undefined){
			
			res.json({records:listOfFiles});
			return ;
		}
		if (err){
			
			  res.json({records:listOfFiles});
			  return ;
		}
	    if( files.length > 1 ) { 	
		files = files.sort((a, b)=>{
			return new Date(b.creationTime) - new Date(a.creationTime);
		});
		}
        // `files` is an array of file paths
		files.map((item)=>{
			  //console.log(item.filePath.toString());
			 if (item.filePath.toString().indexOf('collect') > 0) 
				  return ;
                  //console.log(item.filePath.toString());
			
			if(item.filePath.toString().indexOf(customer) > -1){
				listOfFiles.push(item.filePath.replace(/\\/g, '/'));
				//console.log(item.filePath.toString());
			}
			
		});
        res.json({records:listOfFiles});
    });

});

export default router;