const http = require('http')

const data = JSON.stringify({
  todo: 'Buy the milk'
})
//HTTP://185.27.106.196:21010//oauth/token
const options = {
  hostname: '185.27.106.196',
  port: 21010,
  path: '/oauth/token',
  method: 'POST',
 
   body:   '?grant_type=password&username=admin&password=123456'  
}

const req = http.request(options, res => {
  console.log('statusCode:'+  res.statusCode )

  res.on('data', d => {
   console.log(d);
  })
})

req.on('error', error => {
  console.error(error)
})

 req.write(data);
 //req.end()