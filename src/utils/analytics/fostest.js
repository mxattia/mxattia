
"use strict";
 



const myfoscamera = require('./cameras/foscam/fos.js');

 

var options = {
	host: '31.168.201.31',
    port: 8088,
    user: '1',
    pass: '1'
	 
};
 
let a = new myfoscamera(options );
//let b =  myfoscamera.myevent;
  //a.setup(options);
  a.setup(options,function( cb ) {
	  console.log('...........................',cb);
  }); 
  
  
  
  //a.start();
 //a.status(function( cb ) {
	 //console.log(cb);
 //});
 
 	
a.on( 'alarm', function( a,b,c ) {
		console.log('alarm   ',a,b,c); 
	})
	
a.on( 'data', function( a  ) {
		 console.log('data   ',a ); 
	})	
	
	//'connection-error'
a.on( 'connection-error', function( ax  ) {
		 console.log('connection-error   ',ax );
        //a.stop();
        //a.start();


		
       
		
	})	
	
	a.on('error', function (err) {
	
	console.log('error.PROCESSOR..... '+err);
	 
		a.stop();
	 
	
	    
	
	
	 
});
		
	
// start rotating left
 //a.decoder( 'vertical patrol', function(data) {
 // console.log('............'+data);
  // stop rotation  decoder_control(IO_ON)
 //cam.control.decoder( 'stop vertical patrol', function() {
    
    // take a picture and store it on your computer
 //  a.snapshot( 'save.jpg', console.log )
  
 //   })
  
 	
	
	
	 
