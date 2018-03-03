var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if(!port){
  console.log('请指定端口号好不啦？\n node server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var path = request.url 
  var query = ''
  if(path.indexOf('?') >= 0){ query = path.substring(path.indexOf('?')) }
  var pathNoQuery = parsedUrl.pathname
  var queryObject = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/


if(path === '/'){
  let string = fs.readFileSync('./index.html','utf8')
  response.statusCode=200
  response.setHeader('Content-Type','text/html;charset=utf-8')
  response.write(string)
  response.end()
}else if(path === '/sign_up' && method === "GET"){
  let string = fs.readFileSync('./sign_up.html','utf8')
  response.statusCode=200
  response.setHeader('Content-Type','text/html;charset=utf-8')
  response.write(string)
  response.end()
}else if(path === '/sign_up' && method ==='POST'){
  readBody(request).then((body)=>{
    let strings=body.split('&')  //['email=1','password=2','password_confirmation=3']
    let hash={}
    strings.forEach((string)=>{
      // string == 'email=1'
      let parts=string.split('=') //['email',1]
      let key=parts[0]
      let value=parts[1];
      hash[key]=value
    })
    // let email=hash['email']
    // let password=hash[password]
    // let password_confirmation=hash[password_confirmation]
    let {email, password, password_confirmation}=hash
    if(email.indexOf('@')=== -1){
      response.statusCode=400
      response.setHeader('Content-Type','application/json;charset=utf8')
      response.write(`{
        "errors":{
          "email":"invalid"
        }
      }`)
    }else if(password !== password_confirmation){
      response.statusCode=400
      response.write('password not match')
    }else{
      response.statusCode=200
    }
    response.end()
  })
}

else if (path === '/main.js'){
  let string = fs.readFileSync('./main.js','utf8')
  response.statusCode = 200
  response.setHeader('Content-Type','text/javascript;charset=utf-8')
  response.write(string)
  response.end()
}else if(path === '/vendor/jquery.min.js'){
  let string = fs.readFileSync('./vendor/jquery.min.js')
  response.statusCode=200
  response.setHeader('Content-Type','text/javascript;charset=utf-8')
  response.write(string)
  response.end()
}else if (path==='/XXX'){
  response.statusCode=200
  response.setHeader('Content-Type','text/json;charset=utf-8')
  response.setHeader('Access-Control-Allow-Origin','http://frank.com:8001')
  response.write(`
  {
    "note":{
      "to":"小明",
      "from":"小李",
      "heading":"打招呼",
      "content":"小明你好，我是小李"
    }
  }
  `)
  response.end();
}else {
  response.statusCode = 404
  response.setHeader('Content-Type','text/html;charset=utf-8')
  response.write(
    {
      "error": "not found"
    }
  )
  response.end()
}



  /******** 代码结束，下面不要看 ************/
})

function readBody(request){
  return new Promise((resolve,reject)=>{
    let body=[] // 请求体
    request.on('data',(chunk)=>{
      body.push(chunk)
    }).on('end',()=>{
      body=Buffer.concat(body).toString()
      resolve(body)
    })
  })
}

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)

