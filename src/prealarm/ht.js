var http = require('http');

var options = {
  username: 'admin',
                password: 'a1234',
                host: '37.142.115.48',
                port: '554',
                cameraType: 'DH',
                channel: '7',
				custnumber:'90000',
	            channlrecord:'7',
				
                useWebSocket: true
};

callback = function(response) {
  var str = ''
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    console.log(str);
  });
}

var req = http.request('http://localhost:5000/startStram',options, callback);
//This is the data we are posting, it needs to be a string or a buffer
req.write("data");
req.end();