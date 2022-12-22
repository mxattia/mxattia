import globalConfig from "../config";
import utils from "../utils";

const DEFUALT_FORMAT = "flv";
const FORMATS = {
    "hevc": "mp4"
};

class Camera {

    constructor(config) {
        this.config = config;
        this.streamInformation = {};
        if (config.customUrl && config.customUrl != '') {
            this.url = config.customUrl;
        } else {
            this.url = this.getSourceUrl(config.cameraType, config.username, config.password, config.host, config.port, config.channel,config.custnumber,config.channlrecord);

        }
		
		
		this.ffvlc=this.getFFORVLC(config.cameraType);
        // this.url = config.streamType + "://" + config.username + ":" + config.password + "@" + config.host + ":" + config.port + config.path;
    }
    /**
     * @function
     * @name getConfig
     * @memberof Camera
     * @description - return config param 
     */
    getConfig() {
        return this.config;
    }
    /**
     * @function
     * @name getUrl
     * @memberof Camera
     * @description - return stream url
     */
    getUrl() {
        return this.url;
    }
	
	/**
     * @function
     * @name getFFORVLC
     * @ 
     * @description - return VLC OR FFMPEG
     */
    getFFORVLC(type) {
		if (type.indexOf('VV') > -1) {
		   return 'vlc'	;
		}else{
		    return 'ffmpeg'	;	
		}
         
    }
	
	 getvlc() {
        return this.ffvlc;
    }
	
	
	
    /**
     * @function
     * @name getFeedId
     * @memberof Camera
     * @description - return feedId constructed from host,port and path
     */
    getFeedId() {
        return this.config.host.split('.').join("") + this.config.port + this.config.channel
    }
	
	getcustnumber() {
        return this.config.custnumber  
    }
	
	getchannlrecord() {
		if (this.config.channlrecord==undefined ){
			this.config.channlrecord='0';
		}
        return this.config.host.split('.').join("") + this.config.port + this.config.channlrecord;  
    }
	
	getchanel() {
		if(this.config.channlrecord==undefined){
		   this.config.channlrecord='0';	
		}
        return   this.config.channlrecord;  
    }
    /**
     * @function
     * @name generateBaseUrl
     * @param {string} user - credentials username.
     * @param {string} pass - credentials password.
     * @param {string} host - source of the camera.
     * @param {string} port - port of the camera.
     * @memberof Camera
     * @description - generate base rtsp url for the camera
     */
    generateBaseUrl(user, pass, host, port, protocol) {
        return protocol + "://" + user + ":" + pass + "@" + host + ":" + port + "";
    }
	
	
	//* */
	  
	  
    /**
     * @function
     * @name generateBaseUrlHostPort
     * @param {string} user - credentials username.
     * @param {string} pass - credentials password.
     * @param {string} host - source of the camera.
     * @param {string} port - port of the camera.
     * @memberof Camera
     * @description - generate base rtsp url for the camera
     */
    generateBaseUrlHostPort(host, port, protocol) {
        return protocol + "://" + host + ":" + port + "";
    };
    /**
     * @function
     * @name getSourceUrl
     * @param {string} type - the type of the camera.
     * @param {string} user - credentials username.
     * @param {string} pass - credentials password.
     * @param {string} host - source of the camera.
     * @param {string} port - port of the camera.
     * @param {string} channel - the channel of the camera.
     * @memberof CameraTypes
     * @description - generate rtsp url for the camera
     */
    getSourceUrl(type, user, pass, host, port, channel,custnumber,channlrecord) {
        var URL = "";
		//FF-PRORTSP-SUB
		if (type.indexOf('VV') > -1) {
			type = type.split("VV").join("FF");
			
		}
        switch (type) {
			
			case 'FF-TEST':
			    //vlc -I dummy "rtsp://91.135.105.120:554/chID=3&streamType=sub&linkType=tcp" :network-caching=1000 --sout=#transcode{vcodec=theo,vb=1024,channels=1,ab=128,samplerate=44100,width=320}:http{dst=:8001/webcam.ogg}
 
			    //URL ='http://127.0.0.1:8001/webcam.ogg';
				var rethost = host.split(".").join("");
				 
			    URL = this.generateBaseUrlHostPort('127.0.0.1', '8001', "http") +"/"+ rethost+port+channel+"webcam.ogg";
				console.log('test vlc ',URL);
                break;
			
            case 'FOSCAM':
                URL = this.generateBaseUrlHostPort(host, port, "http") + "/videostream.cgi?user=" + user + "&pwd=" + pass + "";
                break;
				
			 case 'FF-FOSCAM':
			 
                URL= this.generateBaseUrl(user, pass, host, port, "http") + "/videostream.asf"; 
				 
                break;	
			
              case 'FF-IPCAM4G':
			 
                URL= this.generateBaseUrl(user, pass, host, port, "http") + "/cgi-bin/hi3510/tmpfs/auto.jpg"; 
				 
                break;				
				 
            case 'Panasonic':
                URL = this.generateBaseUrl(user, pass, host, port, "http") + "/nphMotionJpeg?Resolution=320x240&Quality=Standard";
                break;
            case 'AXIS':
                URL = this.generateBaseUrl(user, pass, host, port, "http") + "/mjpg/video.mjpg?camera=1";
                break;
            case 'FF-AVTECH':
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + "/live/h264/ch" + channel;
                break;
            case 'rtspavtech':
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + "/live/h264/ch" + channel;
                break;
            case 'RAS':
                URL = this.generateBaseUrl(user, pass, host, port, "http") + "/?action=stream";
            case 'FF-HIKVISION':
                /*camera.php*/
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + "/mpeg4/ch" + channel + "/main/av_stream";
                break;
            case 'rtsp':
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + "/mpeg4/ch" + channel + "/main/av_stream";
                break;
            case 'HIK-NVR':
			    URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + "/Streaming/Channels/" + channel + "02";
                break;
			
            case 'rtspnvr':
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + "/Streaming/Channels/" + channel + "02";
                break;
            case 'FF-HIKVISIONNVR-SUB':
                /*camera.php*/
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + "/Streaming/Channels/" + channel + "02";
                break;
            case 'FF-HIKVISIONNVR-MAIN':
                /*camera.php*/
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + "/Streaming/Channels/" + channel + "01";
                break;
				
			  case 'FF-HIKVISIONIP':
                /*camera.php*/
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + "/Streaming/Channels/" + channel + "02";
                break;	
				
				
            case 'rtspnvrMainstream':
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + "/Streaming/Channels/" + channel + "01";
                break;
            case 'Vigil':
                URL = this.generateBaseUrl(user, pass, host, port, "http") + "/live?camera=1&fps=1&quality=55&speed=1&resolution=200x200";
                break;
            case 'DH':
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + "/cam/realmonitor?channel=" + channel + "&subtype=1";
                break;
            case 'FF-DH-SUB':
                /*camera.php*/
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + "/cam/realmonitor?channel=" + channel + "&subtype=1";
                break;
            case 'FF-DH-MAIN':
                /*camera.php*/
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + "/cam/realmonitor?channel=" + channel + "&subtype=0";
                break;
            case 'GEOVISIONIP':
                URL = 'http://' + host + ':' + port + '/cgi-bin/wappaint?camera_no=' + channel + '&animation=1&name=' + user + '&password=' + pass + '&pic_size=1';
                break;
            case 'VICRON':
                URL = 'http://' + host + ':' + port + '/cgi-bin/wappaint?camera_no=' + channel + '&animation=1&name=' + user + '&password=' + pass + '&pic_size=1';
                break;
            case 'AVIGILON':
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + "/hiQ" + channel + ".sdp";
                break;
            case 'FF-UNIVIEW-MAIN':
			    //rtsp://<ip>:<port>/unicast/c<channel number>/s<stream type>/live
                //<channel number>: 1-n
                //<stream type>: 0(main stream) or 1(sub stream)

                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + '/unicast/c' + channel + '/s0/live';
                break;
            case 'FF-UNIVIEW-SUB':
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + '/media/video' + channel + '"';
                break;
            case 'TIANDY-MAIN':
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + '/' + channel + '/1';
                break;
            case 'TIANDY-SUB':
			    /*
				rtsp://<username>:<password>@<ip>:<port>/<channel>/<stream>

                channel：channel,1 to N;stream：stream,1st stream 1,2nd stream 2.
                 Example：rtsp://admin:admin@192.168.1.3:554/1/1
				 
				*/
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + '/' + channel + '/2';
                break;
            case 'FF-TIANDY-MAIN':
                /*camera.php*/
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + '/' + channel + '/1';
                break;
            case 'FF-TIANDY-SUB':
                /*camera.php*/
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + '/' + channel + '/2';
                break;
				
			 case 'FF-IPCAM1':
                /*camera.php*/
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + '/' + channel + '/1';
                break;	
			 case 'FF-IPCAM2':
                /*camera.php*/
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + '/' + channel + '1';
                break;		
			//IPCAM_V4	
			case 'FF-IPCAM_V4':
                /*camera.php*/
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + '/live/sub' ;
                break;		
            case 'FF-PRORTSP-SUB':
                /*camera.php*/
                //  $camerasChannels[$index]='rtsp://'.$username.':'.$password.'@'.$ExternalIP.':'.$ExternalPort.'/chID='.$index.'&streamType=sub&linkType=tcp';
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + '/chID=' + channel + '&streamType=sub&linkType=tcp';
                break;
				
            case 'FF-PRORTSP-MAIN':
                /*camera.php*/
                // $camerasChannels[$index]='rtsp://'.$username.':'.$password.'@'.$ExternalIP.':'.$ExternalPort.'/chID='.$index.'&streamType=main&linkType=tcp';
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + '/chID=' + channel + '&streamType=main&linkType=tcp';
                break;
				
			case 'FF-PRORTSP-IP':
                /*camera.php  i3340ip56*  /
				/*rtsp://admin:123456@62.90.161.191:8888/profile3*/
                // $camerasChannels[$index]='rtsp://'.$username.':'.$password.'@'.$ExternalIP.':'.$ExternalPort.'/chID='.$index.'&streamType=main&linkType=tcp';
                URL = this.generateBaseUrl(user, pass, host, port, "rtsp") + '/profile3'  ;
                break;	
				
			case 'FF-DAVANTIS':
				    //http://185.27.106.196:21010/cameras/1/stream/mjpeg?frame=false
                   URL= this.generateBaseUrl(user, pass, host, port, "http") + "/cameras/"+channel+"/stream/mjpeg?frame=3";
					break;	
				
				
				
				
            default:
                break;
        }
		
        return URL;
    }
    /**
     * @function
     * @name setStreamInformation
     * @param {object} streamInfo - the streamInfo of the camera.
     * @memberof CameraTypes
     * @description - update stream information using ffprobe
     */
    setStreamInformation(streamInfo) {
        this.streamInformation = streamInfo;
    }
    /**
     * @function
     * @name getStreamInformation
     * @memberof CameraTypes
     * @description - return stream information using ffprobe
     */
    getStreamInformation() {
        return this.streamInformation;
    }
    /**
     * @function
     * @name getStreamFrameRate
     * @memberof CameraTypes
     * @description - return stream frame rate from stream information
     */
    getStreamFrameRatex() {
        let result = globalConfig.websocketStream.rate;
        if (this.streamInformation && this.streamInformation.streams) {
            let sInfo = this.streamInformation.streams;
            if (sInfo.length > 0) {
                for (let stream in sInfo) {
                    let streamTypeInformation = sInfo[stream];
                    if (streamTypeInformation.codec_type == "video") {
                        result = streamTypeInformation.r_frame_rate;
                        if (result && result.toString().indexOf('/') > -1) {
                            return result.split('/')[0];
                        }
                        return result;
                    }
                }
            }
        }
        return result;
    }
    
      //width: 704,
      // height: 576,
      getStreameHW(){
          /*
          { streams:
           [ { index: 0,
               codec_name: 'h264',
               codec_long_name: 'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10',
               profile: 'Main',
               codec_type: 'video',
               codec_time_base: '1/180000',
               codec_tag_string: '[0][0][0][0]',
               codec_tag: '0x0000',
               width: 704,
               height: 576,
               coded_width: 704,
               coded_height: 576,
               has_b_frames: 0,
               sample_aspect_ratio: '0:1',
               display_aspect_ratio: '0:1',
               pix_fmt: 'yuv420p',
               level: 31,
               chroma_location: 'left',
               refs: 1,
               is_avc: '0',
               nal_length_size: '0',
               r_frame_rate: '100/1',
               avg_frame_rate: '0/0',
               time_base: '1/90000',
               start_pts: 3600,
               start_time: '0.040000',
               bits_per_raw_sample: '8',
               disposition: [Object] } ] }
          */
          var result = '720:480';
          if (this.streamInformation && this.streamInformation.streams) {
                var sInfo = this.streamInformation.streams;
                if (sInfo.length > 0) {
                    for (var stream in sInfo) {
                        var streamTypeInformation = sInfo[stream];
                        if (streamTypeInformation.codec_type == "video") {
                            result = (streamTypeInformation.coded_width)+":"+(streamTypeInformation.coded_height);
							 
                             
                        }
                    }
                }else{
                   result ='720:480'; 
                   
                }
            }
            return result;
            
          
      }
	
	  getStreamFrameRate() {
            var result = globalConfig.websocketStream.rate;
			//temp... return only the fix rate
			if (globalConfig.recording.ffprobe==false){
				return result;
			}
			// return result;
			//
            if (this.streamInformation && this.streamInformation.streams) {
                var sInfo = this.streamInformation.streams;
                if (sInfo.length > 0) {
                    for (var stream in sInfo) {
                        var streamTypeInformation = sInfo[stream];
                        if (streamTypeInformation.codec_type == "video") {
                            result = streamTypeInformation.r_frame_rate;
							//console.log('streamTypeInformation.r_frame_rate RRRRRRRRRRRRRRRR'+result);
							//console.log('streamTypeInformation.r_frame_rate FFFFFFFFFFFFFFFF'+ result.toString().indexOf('/') );
							//console.log('streamTypeInformation.r_frame_rate MMMMMMMMMMMMMMMM'+ result.split('/')[0] );
                            if ( result.toString().indexOf('/') > -1) {
								var Trate=result.split('/')[0];
                                if (Trate>200)
                                {
                                   result= globalConfig.websocketStream.rate
                                }else{
                                   result=Trate; 
                                }
                                   
                               
								//if  (Trate < globalConfig.websocketStream.rate){
								//	  return globalConfig.websocketStream.rate;
								//}else{
                                //     return Trate;
								//}
                            }
                            return result;
                        }
                    }
                }
            }
            return result;
        }
	
	
	
	
	
	
	/**
     * @function
     * @name getStreamCodec
     * @memberof CameraTypes
     * @description - return stream codec name from stream information
     */
    getStreamCodec() {
        let result = "";
        if (this.streamInformation && this.streamInformation.streams) {
            let sInfo = this.streamInformation.streams;
            if (sInfo.length > 0) {
                for (let stream in sInfo) {
                    let streamTypeInformation = sInfo[stream];
                    if (streamTypeInformation.codec_name) {
                        result = streamTypeInformation.codec_name;
                    }
                }
            }
        }
        return result;
    }
	
	
	
	 /**
     * @function
     * @name getStreamFormatMapping
     * @memberof CameraTypes
     * @description - return stream format
     */
    getStreamFormatMapping(codec) {
        if (!codec) {
            codec = this.getStreamCodec();
        }
        if (FORMATS[codec]) {
            return FORMATS[codec];
        }
        return DEFUALT_FORMAT;
    }
	
	/**
     * @function
     * @name getRecordOptions
     * @memberof CameraTypes
     * @description - return record options string for encoder
	 * ffmpeg -i source.mp4 -strict experimental -vcodec "flv1" -qscale "4" -an converted.flv 
     */
     getRecordOptions(streamFormat) {
        let recordOptions = {
            "options": "-c:v copy", // record options, basically, used to copy the codec to the file or to apply more options using ffmpeg
            "filePostfix": "", // used when the recording is done with ffmpeg, so there is option to apply pattern when generating segements of videos
            "concateScript": false, // in case the record is done with ffmpeg and the 'options' field is recording segments, there is need to concate the videos
            "useFFMPEG": true, // flag for the stream instance to record with ffmpeg or to write the actual stream to file
            "applyConversion": false // flag for starting the conversion process when the stream is end.
        };
        switch (streamFormat) {
            case "mp4":
                recordOptions =
                    {
                        "options": "-c copy -map 0 -f segment -segment_time 5 -segment_format mp4",
                        "filePostfix": "-%03d",
                        "concateScript": true,
                        "useFFMPEG": false, // in that case, we are just writing the stream to a file
                        "applyConversion": false
                    };
                break;
            default:
                return recordOptions
        }
        return recordOptions;
    }
	/*
	ffmpeg -i source.mp4 -c:v libx264 -ar 22050 -crf 28 destination.flv
	*/
	
	getRecordOptionsToflv(streamFormat) {
         let recordOptions = {
            "options": "-c:v copy",
            "filePostfix": "",
            "concateScript": false
        };
        switch (streamFormat) {
            case "mp4":
                recordOptions =
                    {
                        "options": "-c copy -map 0 -f segment -segment_time 5 -segment_format mp4",
                        "filePostfix": "-%03d",
                        "concateScript": true
                    };
                break;
            default:
                return recordOptions
        }
        return recordOptions;
    }
	
	
	
    /**
     * @function
     * @name setRecordLocation
     * @memberof CameraTypes
     * @description - set record location if recording flag is enabled
     */
    setRecordLocation(location) {
        this.recordLocation = location;
    }
    /**
     * @function
     * @name getRecordLocation
     * @memberof CameraTypes
     * @description - return record location of the camera
     */
    getRecordLocation() {
		if (this.recordLocation=='' || this.recordLocation==undefined){
			this.recordLocation=globalConfig.recording.locationPath+"/"+this.config.custnumber+"/" ;
		}
        return this.recordLocation;
    }
    /**
     * @function
     * @name getStreamFrameRate
     * @memberof CameraTypes
     * @description - return stream frame height and width from stream information
     */
    getStreamResolution() {
        let result = {

        };
        if (this.streamInformation && this.streamInformation.streams) {
            let sInfo = this.streamInformation.streams;
            if (sInfo.length > 0) {
                for (let stream in sInfo) {
                    let streamTypeInformation = sInfo[stream];
                    if (streamTypeInformation.codec_type == "video") {
                        result = {
                            height: streamTypeInformation.height,
                            width: streamTypeInformation.width
                        };
                        return result;
                    }
                }
            }
        }
        return result;
    }
}

export default Camera;