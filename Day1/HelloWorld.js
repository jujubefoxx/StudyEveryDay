// 控制台打印数据
console.log('hello world!')

// http内置API
const http = require('http');

// 主机IP
const hostname = '127.0.0.1';
// 端口号
const port = 3000;

// 创建服务器 通过 request, response 参数来接收和响应数据。
const server = http.createServer((req, res) => {

    // 发送 HTTP 头部
    // HTTP 状态值: 200 : OK
    res.statusCode = 200;
    // 设置头部: 内容类型: text/plain
    res.setHeader('Content-Type', 'text/plain');
    // 也可以合并写为response.writeHead(200, {'Content-Type': 'text/plain'});

    //相应数据到终端页面(doc)
    res.end('Hello, World!\n');
});

// listen 方法绑定主机和端口
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
