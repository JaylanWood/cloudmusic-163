var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
var qiniu = require("qiniu")

if (!port) {
  console.log('请指定端口号。\n例如node server.js 6677 这样')
  process.exit(1)
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url
  var queryString = ''
  if (pathWithQuery.indexOf('?') >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'))
  }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 上面NodeJS ************/

  console.log('含查询字符串的路径\n' + pathWithQuery)

  if (path === '/uptoken') {

    var keyJSON = JSON.parse(fs.readFileSync('./src/json/qiniu-config.json'))
    var accessKey = keyJSON.accessKey
    var secretKey = keyJSON.secretKey
    var options = {
      scope: keyJSON.scope,
    }
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    var putPolicy = new qiniu.rs.PutPolicy(options)
    var uploadToken = putPolicy.uploadToken(mac)

    response.statusCode = 200
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.setHeader('Content-Type', 'application/json')

    response.write(`{
      "uptoken":"${uploadToken}"
    }`)
    response.end()
  } else {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write('请求失败。')
    response.end()
  }

  /******** 下面NodeJS ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用浏览器打开 http://localhost:' + port)