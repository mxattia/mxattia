const events = require('events');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');
const child = require('child_process');
const spawn = child.spawn;
const exec = child.exec;
import config from "../config";
const log = require('node-pretty-log');
const mkdirp = require('mkdirp');
const shell = require('shelljs');
import rimraf from 'rimraf';
const net = require('net');
  
 

class Analytics {

    constructor() {
        this.Emitters = {}
        this.analyticsTimeout = {};
        this.feedsList = {};
        this.analyticsProcessList = {};
		this.tcpmkdList = {};
        this.globalEventHandler =new events.EventEmitter().setMaxListeners(0);
        
		 
	
		
    }
	
	
	 
	
	
    onGlobalMessage(feed, message, connectionType) {
        this.globalEventHandler.emit("ANALYTICS_MANAGER", {
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
     * @memberof Analytics
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
     * @memberof Analytics
     * @description - kill the feed with time delay
     */
    destroyWithDelay(feed) {
        setTimeout(() => {
            this.terminateProcess(feed);
        }, config.delayTimeDestroyProcess * 1000);
    }
    /**
     * @function
     * @name isFeedExist
     * @param {string} feed - camera feed.
     * @memberof Analytics
     * @description - return true if feed exist
     */
    isFeedExist(feed) {
        return this.feedsList[feed] != undefined && this.feedsList[feed] != false;
    }
    /**
     * @function
     * @name initFeed
     * @param {string} feed - camera feed.
     * @memberof Analytics
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
     * @name terminateProcess
     * @param {string} feed - camera feed.
     * @memberof Analytics
     * @description - Kill the process of the given feed
     */
    terminateProcess(feed) {
        let analytics = this.analyticsProcessList[feed];
        if (analytics) {
            analytics.stdin.pause();
            analytics.kill();
            log('warn', "Terminating process =>............ " + feed);
            return true;
        }
        return false;
    }
    /**
     * @function
     * @name setTimeLimit
     * @param {string} feed - camera feed.
     * @memberof Analytics
     * @description - Kill the process of the given feed after period of time, the period of time taken from config.js
     */
    setTimeLimit(feed) {
        this.analyticsTimeout[feed] = setTimeout(function () {
            console.log("Timeout for feed: ", feed);
            let analytics = this.analyticsProcessList[feed];
            if (analytics) {
                analytics.stdin.pause();
                analytics.kill();
                log('warn', "Terminating process => " + feed);
                delete this.analyticsProcessList[feed];
            }
        }.bind(this), config.analytics.defaultAnalyticsTime * 1000);
        return;
    }
    /**
     * @function
     * @name setTimeLimit
     * @param {string} feed - camera feed.
     * @memberof Analytics
     * @description - Kill the process of the given feed after period of time, the period of time taken from config.js
     */
    setTimeLimitCustom(feed, timeout) {
        this.analyticsTimeout[feed] = setTimeout(function () {
            console.log("Timeout for feed: ", feed);
            let analytics = this.analyticsProcessList[feed];
            if (analytics) {
                analytics.stdin.pause();
                analytics.kill();
                log('warn', "Terminating process => " + feed);
                delete this.analyticsProcessList[feed];
            }
        }.bind(this), timeout * 1000);
        return;
    }
    /**
     * @function
     * @name startAnalytics
     * @param {string} feed - camera feed.
     * @param {Camera} camera - camera object.
     * @param {object} analyticsConfig - analytics object. ( tcp details )
     * @param {Function} cb - callback to execute wether the process is started or exist.
     * @memberof Analytics
     * @description - Starting new process with given camera object
     */
    startAnalytics(feed, camera, analyticsConfig, cb) {
         //if (config.analytics.trace==true)
        // {
	       console.log('run..startAnalytics..:' +feed+camera.config.run+this.isFeedExist(feed));
        // }
		 if (this.isFeedExist(feed)==false && camera.config.run=='stop'){
			  
			 if (cb) {

                cb('stop');
                cb = undefined;
              }
			 
			 
             return;
         }			 
		// if (config.analytics.trace==true)
        // {
		    console.log('feed:...start...' +feed);
         //}
		 if (this.isFeedExist(feed) && camera.config.run=='stop') {
               //if (config.analytics.trace==true)
              // {
			     console.log('feed:.sssssssssssssssss..stop...' +feed);
              // }
			   this.terminateProcess(feed);
			  if (cb) {

                cb('stop');
                cb = undefined;
              }
			   //this.terminateProcess(feed);
              return;
			  
         }		 
		 
		 
		 
        if (this.isFeedExist(feed) && camera.config.run=='start') {
            
            
            
            
            
            
		      if (config.analytics.trace==true)
               {
                   console.log('feed:..start...' +feed);
                    console.log('Process list................'+this.analyticsProcessList[feed]);
               }
            if (cb) {

                cb('Connected');
                cb = undefined;
            }
            return;
        }
		   
		   
		 
		  
		  
		   
		  
		  
		  
		
		
		if (this.analyticsProcessList[feed]=='' || this.analyticsProcessList[feed]=='undefined' ){
			//if (config.analytics.trace==true)
            //{
			    console.log(' analyticsProcessList[feed]..'   );
            //}
			 //return ;
		}
         // var analyticsProcess = new spawn('node', ['./utils/analytics/processor', camera.config.host,camera.config.AnalyticsChannel, camera.config.port, camera.config.username, camera.config.password, camera.config.cameraType,camera.config.custnumber,camera.config.mokedccode, analyticsConfig.host, analyticsConfig.port, analyticsConfig.connectionType,camera.config.run], { stdio: ['pipe'], detached: false });
          if (config.analytics.trace==true)
          {
             console.log('./utils/analytics/processor');
          }
         var analyticsProcess = new spawn('node', ['./src/utils/analytics/processor', JSON.stringify(camera),JSON.stringify(analyticsConfig)], { stdio: ['pipe'], detached: false });
		 
         
         
		 //JSON.stringify(options)		   
		 analyticsProcess.stderr.on('data', (data) => {
              if (config.analytics.trace==true)
              {   
                console.log('stderr:............'+data  );
              }
               this.feedsList[feed] = false;
			   this.terminateProcess(feed);
			  
              
              
              
			  if (cb) {

                cb('error');
                cb = undefined;
				
				//this.terminateProcess(feed);
				
				
            }
            return;
			  
			  
			  
			  
        });
		
		 
		
        analyticsProcess.on('close', function (buffer) {
            this.feedsList[feed] = false;
			this.terminateProcess(feed);
			 if (cb) {
                    cb('close');
                    cb = undefined;
                }
			 
			
            //console.log("Analytics process closed, "+ camera.url);
        }.bind(this));
        analyticsProcess.stdout.on('data', function (buffer) {
             if (config.analytics.trace==true)
             { 
			      console.log(' processor.js--> buffers.from analytics file-->> '+buffer.toString().trim());
             }
             
			 if (buffer.toString().indexOf("Unauthorized") > -1) {
                 //if (config.analytics.trace==true)
                // {
                   console.log("analytics  Unauthorized");
                 //}
                 this.feedsList[feed] = false;
                 this.terminateProcess(feed);
                if (cb) {
                    cb('error');
                    cb = undefined;
                }
                 
                 
                 
                 
             }
            
			if (buffer.toString().indexOf("error") > -1) {
                this.feedsList[feed] = false;
                this.terminateProcess(feed);
                if (cb) {
                    cb('error');
                    cb = undefined;
                }
				 
				//this.terminateProcess(feed);
				
				
				
            }
			
			
			
		 	   
			
			
			
			
            if (buffer.toString().indexOf("Connected") > -1) {
                this.feedsList[feed] = true;
                if (cb) {
                    cb('Connected');
                    cb = undefined;
                }
            }else if (buffer.toString().indexOf("Error") > -1) {
						
						 
				if (cb) {
                    cb('error');
                    cb = undefined;
                }
				
				
				this.feedsList[feed] = false;
				this.terminateProcess(feed);
						
				 		
			
			
			}else if (buffer.toString().indexOf("closed") > -1) {
						
						 
				if (cb) {
                    cb('error');
                    cb = undefined;
                }
				this.feedsList[feed] = false;
				this.terminateProcess(feed);
						 
					
					    
						
				 
			
			}
			
			
			
			
            //log("info", "Analytics process 1 " + buffer.toString());
        }.bind(this));



        //this.tcpmkdList[analyticsConfig.host+analyticsConfig.port]=analyticsConfig.host+analyticsConfig.port;
		
        //this.analyticsProcessList[feed] = analyticsProcess;
		// this.analyticsProcessList[feed]=camera;
        //this.setTimeLimitCustom(feed, analyticsConfig.period);
		
		this.analyticsProcessList[feed] = analyticsProcess;
		this.analyticsProcessList[feed]['camera']=camera;
		
		
		
		
        return;
    }
	
	/**
     * @function
     * @name startAnalytics
     * @param {string} feed - camera feed.
     * @param {Camera} camera - camera object.
     * @param {object} analyticsConfig - analytics object. ( tcp details )
     * @param {Function} cb - callback to execute wether the process is started or exist.
     * @memberof Analytics
     * @description - Starting new process with given camera object
     */
    startAnalyticsPromise(feed, camera, analyticsConfig, cb) {
         
	     console.log('run....:' +camera.config.run);
		 
		 return new Promise((resolve, reject) => {
				 console.log('feed:' +feed);
				 if (this.isFeedExist(feed) && camera.config.run=='stop') {
					  this.terminateProcess(feed);
					  resolve('stop');
					  return;
					  
				 }		 
				 
				 
				 
				if (this.isFeedExist(feed)) {
					 if (this.analyticsProcessList[feed]['camera'].config  != camera.config ){
					 //if (this.analyticsProcessList[feed]['camera'].config.AnalyticsChannel != camera.config.AnalyticsChannel){
						 this.terminateProcess(feed);
						console.log('process again..........',this.analyticsProcessList[feed]['camera'].config.AnalyticsChannel   );
					 }else{
					
					
					//console.log('on................',this.analyticsProcessList[feed].config.run   );
					resolve('httpon');
					
					
					return;
				}
				}
				   
				   
				   
			  //console.log('Process list.............'+this.analyticsProcessList[feed]);
				  
				  
				   
				  
				  
				  
				
				
				if (this.analyticsProcessList[feed]=='' || this.analyticsProcessList[feed]=='undefined' ){
					 resolve('error');
					 return ;
				}
				var analyticsProcess = new spawn('node', ['./src/utils/analytics/processor', camera.config.host,camera.config.AnalyticsChannel, camera.config.port, camera.config.username, camera.config.password, camera.config.cameraType,camera.config.custnumber,camera.config.mokedccode, analyticsConfig.host, analyticsConfig.port, analyticsConfig.connectionType], { stdio: ['pipe'], detached: false });
				   
				analyticsProcess .stderr.on('data', (data) => {
					  console.log('stderr:'+data  );
					  resolve('error');
					  return ;
				});
				
				 

				
				
				
				
				analyticsProcess.on('close', function (buffer) {
					this.feedsList[feed] = false;
					
					 resolve('close');
					 
					
					console.log("Analytics process closed, "+ camera.url);
				}.bind(this));
				analyticsProcess.stdout.on('data', function (buffer) {
					console.log('buffers.from analytics..xx.'+buffer.toString().trim());
					
					//send to client//
					
					   
					//closed
					
					
					
					if (buffer.toString().indexOf("Connected") > -1) {
						this.feedsList[feed] = true;
						resolve('Connected');
					}else if (buffer.toString().indexOf("Error") > -1) {
						
						resolve('error');
					}else if (buffer.toString().indexOf("closed") > -1) {
						 
						this.terminateProcess(feed);
						 
					
					    resolve('stop');
						
						
						
						
					}	
					
					
					
					log("info", "Analytics process 1 " + buffer.toString());
				}.bind(this));



				//this.tcpmkdList[analyticsConfig.host+analyticsConfig.port]=analyticsConfig.host+analyticsConfig.port;
				this.analyticsProcessList[feed] = analyticsProcess;
				this.analyticsProcessList[feed]['camera']=camera;
				//this.setTimeLimitCustom(feed, analyticsConfig.period);
				return;
			});
			 
		 };
		 

}

export default Analytics;