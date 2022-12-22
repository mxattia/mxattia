
"use strict";
 



const myfoscamera = require('./cameras/provision/provision.js');

 

var options = {
	host: '62.90.161.191',
    port: 8181,
    user: 'admin',
    pass: '123456'
	 
};


var options  = {
	host: '82.81.5.105',
    port: 90,
    user: 'admin',
    pass: 'kl123456'
	 
};


//http://82.81.5.105:90
//admin kl123456
 
let a = new myfoscamera(options );
//let b =  myfoscamera.myevent;
  //a.setup(options);
  
  a.setup(options,function( cb ) {
	  //console.log('...........................',cb);
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
  
 	
	
	
	 
