/*
ffmpeg -loop 1 -framerate 1 -err_detect aggressive -fflags discardcorrupt -s 1280x720 -i http://admin:admin@195.133.159.74/cgi-bin/hi3510/tmpfs/snap.jpg -vf scale=320:240 -r 40 -f mpegts -vcodec mpeg1video -t 00:05:00 video1.mp4
http://192.168.1.106:9898/api/getinfo?ip=84.110.155.146/&port=8000&username=admin&password=Aa1234567

*/
const events = require('events');
const child = require('child_process');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');
const spawn = child.spawn;
const exec = child.exec;
import config from "../config";
const log = require('node-pretty-log');
const mkdirp = require('mkdirp');
const shell = require('shelljs');
import rimraf from 'rimraf';
var fs = require('fs');
var ffmpegx = require('fluent-ffmpeg');
//var VLC = require('node-vlc-json');
//const { execvlc } = require('child_process'); 

var os = require('os');
 



var portindex=6000;
function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}
class Streams {

    constructor() {
        this.Emitters = {}
        this.firstChunks = {};
        this.ffmpegTimeout = {};
        this.clientsPerFeed = {};
        this.feedsList = {};
		 
        this.ffmpegProcessList = {};
        this.globalEventHandler = new events.EventEmitter().setMaxListeners(0);

    }
    onGlobalMessage(feed, message, connectionType) {
		console.log('feed............'+feed );
		 
        this.globalEventHandler.emit("STREAMS_MANAGER", {
            feed: feed,
            message: message,
            connectionType: connectionType
        });
    }
    getGlobalEventHandler() {
        // handle messages
        return this.globalEventHandler;
    }
    /**
     * @function
     * @name getNumberOfClients
     * @param {string} feed - camera feed.
     * @memberof Streams
     * @description - return the number of actual listeners of the given feed
     */
    getNumberOfClients(feed) {
        let numberOfClients = this.Emitters[feed].listenerCount('data');
        if (numberOfClients <= 0) {
            setTimeout(() => {
                let doubleCheckNumberOfClients = this.Emitters[feed].listenerCount('data');
                if (doubleCheckNumberOfClients <= 0) {
                     this.terminateProcess(feed);
                }
            }, config.delayTimeDestroyProcess * 1000);

        }
        return this.Emitters[feed].listenerCount('data');
    }
    /**
     * @function
     * @name destroyWithDelay
     * @param {string} feed - camera feed.
     * @memberof Streams
     * @description - kill the feed with time delay
     */
    destroyWithDelay(feed) {
        setTimeout(() => {
			 if (config.delayTimeDestroyProcess!=0){
                 this.terminateProcess(feed);
				 console.log('interviewing the interval..'+config.delayTimeDestroyProcess * 1000);
			 }else{
				 console.log('Not Stop Ffmpeg....'+config.delayTimeDestroyProcess * 1000);
				 
			 }
			
        }, config.delayTimeDestroyProcess * 1000);
    }
    /**
     * @function
     * @name isFeedExist
     * @param {string} feed - camera feed.
     * @memberof Streams
     * @description - return true if feed exist
     */
    isFeedExist(feed) {
        return this.feedsList[feed] != undefined && this.feedsList[feed] != false;
    }
    /**
     * @function
     * @name initFeed
     * @param {string} feed - camera feed.
     * @memberof Streams
     * @description - return new EventEmitter for the give feed
     */
    initFeed(feed) {

        if (!this.Emitters[feed]) {
            this.Emitters[feed] = new events.EventEmitter().setMaxListeners(0)
            log('success', "Create new feed " + feed);
        }
        return this.Emitters[feed]
    }
    /**
     * @function
     * @name initFirstChunk
     * @param {string} feed - camera feed.
     * @param {bytes} firstBuffer - camera first buffer.
     * @memberof Streams
     * @description - return the first buffer of given feed
     */
    initFirstChunk(feed, firstBuffer) {
        if (!this.firstChunks[feed]) {
            this.firstChunks[feed] = firstBuffer
        }
        return this.firstChunks[feed]
    }
    /**
     * @function
     * @name terminateProcess
     * @param {string} feed - camera feed.
     * @memberof Streams
     * @description - Kill the process of the given feed
     */
    terminateProcess(feed) {
        let ffmpeg = this.ffmpegProcessList[feed];
        if (ffmpeg) {
            ffmpeg.stdin.pause();
            ffmpeg.kill();
            log('warn', "There is no clients, Terminating process => " + feed);
            return true;
        }
        return false;
    }
    /**
     * @function
     * @name setTimeLimit
     * @param {string} feed - camera feed.
     * @memberof Streams
     * @description - Kill the process of the given feed after period of time, the period of time taken from config.js
     */
    setTimeLimit(feed) {
        this.ffmpegTimeout[feed] = setTimeout(function () {
            let ffmpeg = this.ffmpegProcessList[feed];
            if (ffmpeg) {
                ffmpeg.stdin.pause();
                ffmpeg.kill();
                log('warn', "Terminating process => " + feed);
                delete this.ffmpegProcessList[feed];
            }
        }.bind(this), config.defaultStreamTime * 1000);
        return;
    }
    /**
     * @function
     * @name getStreamInformation
     * @param {Camera} camera - camera object.
     * @param {Function} cb - callback to execute with the information.
     * @memberof Streams
     * @description - return information on the camera
     */
    getStreamInformation(camera, cb) {
		
		if (config.recording.ffprob==false){
			cb({});
			 
		}else{
		
        ffprobe(camera.getUrl(), { path: ffprobeStatic.path }, function (err, info) {
            if (err) {
                cb({});
            } else {
                cb(info);
            }

        });
		}
    }
	
	  
    /**
     * @function
     * @name startStream
     * @param {string} feed - camera feed.
     * @param {Camera} camera - camera object.
     * @param {Function} cb - callback to execute wether the process is started or exist.
     * @memberof Streams
     * @description - Starting new process with given camera object
     */
    startStream(useWebSocket, feed, camera, cb) {
		
        if (this.isFeedExist(feed)) {
			 
            if (cb) {

                cb();
                cb = undefined;
            }
			console.log('isFeedExist(feed)',feed);
            return;
        }
		
		
		
		 
		
		
		
        let url = camera.getUrl();
		console.log('camera url...............'+url);
        
		if (url=='0' || url==''){
			  
			return ;
		}
         
        // console.log("Stream Resolution: " + camera.getStreamResolution());
		
        // console.log("Stream Information: ", camera.getStreamInformation());

        let ffmpegString = '';
        let camFormat = '';
        let camRecordOptions = {};
        let streamPath = '/streamIn/' + feed;
		let channlrecord ='0';
		
		if (camera.getchanel()!='0'){
			 channlrecord =  camera.getchannlrecord();
		}
		
		
       
        if (useWebSocket === true) {
            //camera.getStreameHW()  //' -vf scale=360:240 ' -hide_banner -y
            ffmpegString = '-hide_banner -y '+'-threads 2 '+ '-rtbufsize 1G -r '+camera.getStreamFrameRate() + ' -i ' + url + ' -vf scale='+camera.getStreameHW()+' '  ;
			console.log("----------------"+config.recording.enable +"----"+ config.recording.useFFMPEG);
            if (config.recording.enable && config.recording.useFFMPEG) {
                camFormat = camera.getStreamFormatMapping();
                camRecordOptions = camera.getRecordOptions(camFormat);
                ffmpegString += '-f ' + camFormat + ' ' + camRecordOptions.options + ' ' + camera.getRecordLocation() + feed + camRecordOptions.filePostfix + '.' + camFormat + ' ';
            } else if (config.recording.enable && !config.recording.useFFMPEG) {
                let paramertizedFileLocation = camera.getRecordLocation() + feed  ;
				     
                    paramertizedFileLocation = paramertizedFileLocation.replace(new RegExp('/', 'g'), '+').replace('.','-');
                   
					if (paramertizedFileLocation==''){
						return ;
					}
                    //streamPath += '/' + paramertizedFileLocation;
					  if (camera.getchanel()!='0') {
				         streamPath    += '/' + paramertizedFileLocation+"/"+ camera.getchannlrecord() ;
				     }else{
					  	 streamPath    += '/' + paramertizedFileLocation +"/0" ;
						
					  }
				
				 
            }
  ffmpegString += '-f mpegts -r ' + camera.getStreamFrameRate() + ' -q ' + config.websocketStream.quality + ' -loglevel error -c:v mpeg1video -an -t 00:05:00 ' + (process.env.NODE_ENV == "production" ? 'https://'+ config.host : 'http://' + config.host + ':' + config.port) + streamPath  ;
 //ffmpegString += '-f mpegts -r ' + camera.getStreamFrameRate() + ' -q ' + config.websocketStream.quality + ' -c:v mpeg1video -an ' + (process.env.NODE_ENV == "production" ? 'https://'+ config.host : 'http://' + config.host + ':' + config.port) + streamPath  ;
   

        } else {
            
			ffmpegString = '-i ' + url + ' -c:v copy -an -f ' + config.recording.defaultExtension + ' pipe:1' ;
        } 
		
		 
		

        if (ffmpegString.indexOf('rtsp://') > -1) {
            ffmpegString = '-rtsp_transport tcp ' + ffmpegString
        }
	     this.getStreamInformation(camera, function(data){
			console.log(data);
		}); 
		
		if (ffmpegString.indexOf('auto.jpg') > -1) {
			console.log('ipcam4g....',url);
			//ffmpeg -loop 1 -f image2 -framerate 1 -i http://admin:admin@31.154.237.165/cgi-bin/hi3510/tmpfs/snap.jpg -f mpegts -r 20 -vcodec mpeg1video -t 00:05:00 video1.mp4
			//ffmpeg -loop 1 -i http://admin:admin@195.133.159.74:80/cgi-bin/hi3510/tmpfs/auto.jpg -f mpegts -vcodec mpeg1video -t 00:05:00 video.mp4 
			//ffmpeg -loop 1 -framerate 1 -err_detect aggressive -fflags discardcorrupt -i http://admin:admin@195.133.159.74/cgi-bin/hi3510/tmpfs/snap.jpg -vf scale=320:240 -f mpegts -r 20 -vcodec mpeg1video -t 00:05:00 video1.mp4

			
			ffmpegString='-y -loop 1 -framerate 1 -err_detect aggressive -fflags discardcorrupt -s 320x240 -i '+url+' -f mpegts -loglevel error -vf scale=320:240 -r 20 -vcodec mpeg1video -t 00:05:00 '+(process.env.NODE_ENV == "production" ? 'https://'+ config.host : 'http://' + config.host + ':' + config.port) + streamPath  ;
		}
		
		console.log('display ffmpeg or vlc..',camera.getvlc());
		
		if (camera.getvlc() =='vlc') {
			console.log('vlc....',url);
			
			console.log('portindex...........',portindex);
			if (portindex>7000)
			{
				portindex=6000;
			}else{
				portindex++;
			}
        		 
				
			
			
			 
//var r='start vlc.exe  -I -rc --stop-time 60 -vvv "rtsp://admin:2468Tohar@91.135.105.120:554/chID=3&streamType=sub&linkType=tcp" size="640x480" --sout="#transcode{vcodec=mp4v,vb=1024,channels=1,ab=128,samplerate=44100,width=320}:http{dst=:8081/911351051205543webcam.ogg}';
//var r1='start vlc.exe  -I -rc --stop-time 60 -vvv "rtsp://admin:2468Tohar@91.135.105.120:554/chID=2&streamType=sub&linkType=tcp" size="640x480" --sout="#transcode{vcodec=mp4v,vb=1024,channels=1,ab=128,samplerate=44100,width=320}:http{dst=:8082/911351051205543webcam.ogg}';
			 
			  //var vlcstart='start vlc.exe  -I -rc --stop-time 120 -vvv "'+url+'" size="640x480" --sout="#transcode{vcodec=FLV1,acodec=mp3,ab=128,channels=2,samplerate=44100}:duplicate{dst=std{access=http{mime=video/x-flv},mux=ffmpeg{flv},dst=:'+portindex.toString()+'/'+camera.getFeedId()+'webcam.ogg}}'
			   var deftimestream=config.defaultStreamTime  ;//#transcode{vcodec=theo,fps=10}:http{dst=:8090/2551211735542webcam.ogg} 
			   //#transcode{vcodec=mp4v,vb=1024,channels=1,ab=128,samplerate=44100,width=640,fps=10}:http{dst=:'+portindex.toString()+'/'+camera.getFeedId()+'webcam.ogg}' ;
			   var vlcstart='vlc.exe -I -rc --waveout-audio-channels=1 --no-one-instance'+' --stop-time '+deftimestream.toString()+' -vvv "'+url+'"'+' --rtsp-user='+camera.getConfig().username+' --rtsp-pwd='+camera.getConfig().password+' --sout=#transcode{vcodec=mp4v,vb=1024,channels=1,ab=128,samplerate=44100,width=640,fps=60}:http{dst=:'+portindex.toString()+'/'+camera.getFeedId()+'webcam.ogg}' ;
			    
			   console.log( vlcstart);
			   //var vlcstart='start vlc -I -rc --stop-time '+deftimestream.toString()+' -vvv "'+url+'" --sout="#transcode{vcodec=mp4v,vb=1024,channels=1,ab=128,samplerate=44100,width=320}:http{dst='+config.host+':'+config.port+'/'+camera.getFeedId()+'webcam.ogg}' ;
			  //const ls = exec('start vlc.exe  -I -rc --stop-time 60 -vvv "rtsp://91.135.105.120:554/chID=1&streamType=sub&linkType=tcp" size="640x480" --sout="#transcode{vcodec=FLV1,acodec=mp3,ab=128,channels=2,samplerate=44100}:duplicate{dst=std{access=http{mime=video/x-flv},mux=ffmpeg{flv},dst=:8083/stream1.flv}} ', function (error, stdout, stderr) {
			   var self = this;	  
			   //const ls = exec(vlcstart,{async:true}, function (error, stdout, stderr) { 
               const ls = new exec(vlcstart ,function (error, stdout, stderr) { 				   
				  if (error) {
						 console.log('..................................',ls.pid);
						 exec('taskkill -F -T -PID '+ls.pid);
						//console.log('Error code: '+error.code);
						//console.log('Signal received: '+error.signal);
						return ; 
				  }
				        
				        //console.log('Child Process STDOUT: '+stdout);
				        //console.log('Child Process STDERR: '+stderr);
				});
				 console.log('vlc............',feed,'------',camera.getFeedId()); 
				 //self.feedsList[feed] = true;
				 console.log('os..............',os.platform(),ls.pid);
				 var timepid=Number(deftimestream)*900 ;
				 console.log('timepid....',timepid);
				 setTimeout(function()
				{ 
 
				   
                   if(os.platform() === 'win32'){
					    
					    
					    console.log('kill..32............',ls.pid); 
						exec('taskkill -F -T -PID '+ls.pid)
						exec('taskkill /IM "vlc.exe" -T -F');
						 
					}else{
						ls.kill();  
						console.log('kill....',ls.pid); ;
					}
                   
				
				
				}, timepid);

				ls.on('exit...', function (code) {
					 
				  console.log('Child process exited with exit code '+ls.pid);
				  exec('taskkill /IM "vlc.exe" -T -F');
				  //exec('taskkill /IM -PID '+ls.pid);
				});
				
				//sleep(10000).then(() => {
					 console.log('ffmpeg connect after vlc............',vlcstart,camera.getFeedId()); 
                      var vlchost='http://127.0.0.1:'+portindex.toString()+'/'+camera.getFeedId()+'webcam.ogg';					 
					  //var vlchost='http://'+config.host+':'+config.port+ '/'+camera.getFeedId()+'webcam.ogg' 
					 //*ffmpegString='-reconnect 1 -reconnect_at_eof 1 -reconnect_streamed 1 -reconnect_delay_max 5 -i '+vlchost+' -f mpegts -loglevel error -vf scale=320:240 -r 20 -vcodec mpeg1video -t 00:05:00 '+(process.env.NODE_ENV == "production" ? 'https://'+ config.host : 'http://' + config.host + ':' + config.port) + streamPath  ;
					 ffmpegString='-reconnect 1 -reconnect_at_eof 1 -reconnect_streamed 1 -reconnect_delay_max 5 -err_detect ignore_err -i '+vlchost+' -f mpegts -vf scale=320:240 -r 20 -vcodec mpeg1video -t 00:05:00 '+(process.env.NODE_ENV == "production" ? 'https://'+ config.host : 'http://' + config.host + ':' + config.port) + streamPath  ;
					 //-reconnect 1 -reconnect_at_eof 1 -reconnect_streamed 1 -reconnect_delay_max 2 
					  console.log('ffmpeg ',ffmpegString);  

                      log("success", "ffmpeg url vlc :" + ffmpegString.split(' '));
			 		  var ffmpeg = new spawn('ffmpeg', ffmpegString.split(' '), { stdio: ['pipe'], detached: true });
			 			// log('success', "Starting new process => " + ffmpegString);
                      self.feedsList[camera.getFeedId()] = true;
			 		   
                       





					  
				   //});
				
				 
			 
		}else{	 
			
			 
		    log("success", "ffmpeg url :" + ffmpegString);
		    var ffmpeg = new spawn('ffmpeg', ffmpegString.split(' '), { stdio: ['pipe'], detached: true });
		    log('success', "Starting new process => " + ffmpegString);

		    this.feedsList[feed] = true; 		
			 
			 
			 
			 
		} 
			
		
           
		
			 
			
		 
		
		   
		
        ffmpeg.on('close', function (buffer) {
            this.feedsList[feed] = false;
			// notify users in case of closing ffmpeg
             //this.onGlobalMessage(feed, "FFMPEG_CLOSEx", useWebSocket);
            delete this.ffmpegProcessList[feed]; 
			console.log("process is closed  ");
            // In case we are generating videos in small chunks, there is need to concate them after the stream is ends
            if (config.recording.enable &feed == camera.getchannlrecord() ) {
				 console.log("process is concateScript"+camera.getRecordLocation()+ feed);
			    // var concate = spawn('/bin/bash', ['scripts/concate-videos.sh', camera.getRecordLocation(), feed], { detached: true });
				var fileName=camera.getRecordLocation()+ feed;
				if  (fs.exists(fileName+'.stream', function (exists) {
	                console.log(exists);
                    if(exists){
						  
						 ffmpegx(fileName+'.stream').videoCodec('libx264').size('320x200').format('flv').save(fileName+'.flv').on('end', function() {
                              console.log('Finished processing');
						 	 fs.unlinkSync(fileName+'.stream');
							 
                           });
						   
					     
                    } else {
                        //var write = fs.createWriteStream(fileName); 
                        //ffmpeg('C:/jsmkd/rtsp-recording/records/456789/462101231495541/201904281039/462101231495541.stream').format('flv').pipe(write, {end: true}); 		   
                    }
                  }));
				 
			}
			
			 
			
        }.bind(this));
        if (!useWebSocket) {
            //// FFMPEG Error Logs
            ffmpeg.stderr.on('data', function (buffer) {

                console.log(feed + ": has errors, exit", buffer.toString());
            });
            //data from pipe:1 output of ffmpeg
            ffmpeg.stdio[1].on('data', (buffer) => {
				
                this.feedsList[feed] = true;

                this.initFirstChunk(feed, buffer)
                this.initFeed(feed).emit('data', buffer);
                if (cb) {
                    cb();
                    cb = undefined;
                }

            });
        } else {
            ffmpeg.stderr.on('data', function (buffer) {
                // handle messages
                if (config.ffmpeg.showOutput) {
                    console.log('handle err from ffmpeg...'+feed+' '+buffer.toString());
					
                }
				
				//this.feedsList[feed] = false;
			   // notify users in case of closing ffmpeg
                
				
				

                this.handleMessages(feed, buffer.toString(), useWebSocket);
				//-----if err terminateProcess 26-05-2019
				  //this.terminateProcess(feed);  
				
				 return ;
				
				
				

            }.bind(this));
            // everything is ok, if something will fail, clients will be notified with error
            setTimeout(function(){
            if (cb) {
                cb();
                cb = undefined;
            }
             }, 1000);

        }
         
        this.ffmpegProcessList[feed] = ffmpeg;
        this.setTimeLimit(feed);

        return;
    }
	/**
     * @function
     * @name handleMessages
     * @param {string} feed - camera feed.
	 * @param {string} buffer - camera stream data.
	 * @param {string} useWebSocket - stream mode
	 * @memberof Streams
     * @description - Check if the buffer contain any error
     */
	handleMessages(feed, buffer, useWebSocket){
		//  console.log(buffer);
		if (buffer.toString('utf8').trim()==''){
			return ;
		}
		
		if (buffer.toString('utf8').trim().indexOf('Unauthorized') > -1 ) {
		
	    	this.onGlobalMessage(feed, "AUTHENTICATION_FAILURE", useWebSocket);
		}
		return;
		
		
		//Unauthorized (authorization failed)
		//console.log('err  handle ....'+buffer.toString('utf8').indexOf('Unauthorized')); //Unauthorized
		if (buffer.toString('utf8').indexOf('Unauthorized') > -1) {
			// handle error
			console.log('err  handle ....'+buffer.toString('utf8'));
			this.onGlobalMessage(feed, "AUTHENTICATION_FAILURE", useWebSocket);
			 
		}
		
		// SEI
		
		if (buffer.toString('utf8').indexOf('SEI') > -1) {
			// handle error
			this.onGlobalMessage(feed, "VIDEO PROBLEM", useWebSocket);
		}
		if (buffer.toString('utf8').indexOf('error') > -1) {
			// handle error
			this.onGlobalMessage(feed, "VIDEO error", useWebSocket);
		}
		
		if (buffer.toString('utf8').indexOf('404') > -1) {
			// handle error
			this.onGlobalMessage(feed, "404", useWebSocket);
		}
		
		// Invalid data found when processing input
		if (buffer.toString('utf8').indexOf('Invalid data found when processing input') > -1) {
			// handle error
			this.onGlobalMessage(feed, "Invalid data found when processing input", useWebSocket);
		}
		
		
		
		
		
	}
}

 
export default Streams ;