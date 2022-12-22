function getQueryParams1() {
    var qs = document.location.search;
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

function getQueryParams() {
    var a = document.location.search;
    a = a.split('+').join(' ');

    var b = {},
        c,
        d = /[?&]?([^=]+)=([^&]*)/g;

    while (c = d.exec(a)) {
        b[decodeURIComponent(c[1])] = decodeURIComponent(c[2]);
    }

    return b;
}




var urlParams = getQueryParams();
const players = {};
const sockets = {};
 var baseUrl = '' ;//window.streamServerBaseUrl ? streamServerBaseUrl : "";




function connectStreamWS(element, config,streamServerBaseUrl,callback ) {
	
    console.log('connectStreamWS.................'+ streamServerBaseUrl);
	//$("#" + element).show();  
	 
	var baseUrl =streamServerBaseUrl; 
	 
    var jqxhr = $.post(baseUrl+"/startStream", config, function (data) {
		console.log('data  '+data.status+ ' config ' +baseUrl);
		console.log('Post..startStream '+data.feedId);
		console.log('Post..channelrecord '+config.channlrecord);
        if (data.status != 'OK') {
			console.log('err  not ok');
            var xRet=false;
			return ;
        }
		 //var xRet=true;
		 // callback(xRet);
		  
		  
		 
		  
		    
		  
		  
		
		//console.log('IN  POST...'+baseUrl);
		
		
		
		
        //start socket.io client connection
        sockets[data.feedId.toString()] = io(baseUrl);
        //on socket.io connection success
		
		   
        sockets[data.feedId.toString()].on('connect', function () {
			
			  
              //pretend this is the command you use to initiate getting H.264 (MPEG) data
              sockets[data.feedId.toString()].emit('f', { function: 'getStream', feed: data.feedId });
			
			  $("#" + element).show();  
			  var p = document.querySelector(".content p");
			  p.style.color = "green";
			  console.log('connect..socket to server .'   );
			  
			  var c = document.getElementById(element);
              // initiate a player that can be piped to.
		
		
		     try{
		
               var instance = new Stream();
               players[data.feedId.toString()] = new instance.Player('pipe', {
               canvas: c , autoplay: true, loop: true
			 
               });
		
		      }
               catch(err) {
                  //console.log(err.message);
              }
		
			  
			  
			  
			  
			 
			 
        });
        
		
		//on data from "h264" handle
        sockets[data.feedId.toString()].on('h264', function (data) {
			
			try {
			 
            players[data.feed].write(data.buffer, function(){});
			
			}
             catch(err) {
                 //console.log(err.message);
               }
			
			
			
			
        });
		
		
		
        //on data from "h264" handle
        sockets[data.feedId.toString()].on('h264-error', function (data) {
			
			 console.log('disconnect..FFMPEG_FAILURE..'+data.message);
			 
			   
			 
			 
			  var p = document.querySelector(".content p");
			   p.textContent=data.message +" "+data.feed  ;
			   p.style.color = "red";
			  
            
        });
		
		 
		sockets[data.feedId.toString()].on('close', function (data) {
			
			 console.log('disconnect....'+element);
			 
			  var p = document.querySelector(".content p");
			  p.style.color = "orange";
			     
			 
            
        });
		
		 
		// on data error
        sockets[data.feedId.toString()].on('Unauthorized', function (data) {
            console.log("error received from server......", data.message);
			//Unauthorized
			 
			 $("#" + element).hide();
			  
			 
             

            
			  
			 
			  var p = document.querySelector(".content p");
			  
			  
			  if(data.message.toString('utf8').indexOf('Unauthorized') > -1) {
			 
			   p.textContent=data.message;
               p.style.color = "red";
			 }
			 
			 
			 
			 
			 
			 
        });
		
		 
		
		
		sockets[data.feedId.toString()].on('disconnect', function (data) {
			  
			 console.log('disconnect'+element);
			 $("#" + element).hide();
			 
			  var p = document.querySelector(".content p");
			  p.style.color = "orange";
			  
			 
			 
			 
             
        });
		
		$("#" + element  ).click(function () {
		console.log('click');
       // var el = document.getElementById(element);
		 
       // el.webkitRequestFullScreen();
		
		var elem = document.getElementById(element);
        if (elem.webkitRequestFullscreen) {
           elem.webkitRequestFullscreen();
        }
		
		
		
		
		
		
		
    });
		
		
		
		
		
		

    }) 
	.fail(function() {
        //alert( "error" );
	    //server fault
	    var xRet=false;
	    callback(xRet,element, config,streamServerBaseUrl);
	   
	   
    
	
	   $("#" + element).hide();
	 
	   var p = document.querySelector(".content p");
		   p.style.color = "orange";
	
	 
	
	
	
	
	     console.log('AFTER POST...');
	 
	 });
	 
    
    
}

function connectStreamHTTP(element, config) {
    $.post(baseUrl+"/startStream", config, function (data) {
        if (data.status != 'OK') {
            return;
        }
        players[data.feedId] = flvjs.createPlayer({
            type: 'flv',
            isLive: true,
            url: baseUrl+'/flv/' + data.feedId
        });


        players[data.feedId].attachMediaElement(document.getElementById(element));
        players[data.feedId].on('error', function (err) {
            console.log(err)
        });
        players[data.feedId].load();
        players[data.feedId].play();
        players[data.feedId].on("STATISTICS_INFO", function (data) {
            console.log(data.feedId, data);
        })
    });
    $("#" + element + "Enlarge").click(function () {
        var el = document.getElementById(element);
        el.webkitRequestFullScreen();
    });
}