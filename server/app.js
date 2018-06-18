var ws = require("nodejs-websocket");

var server = ws.createServer(function (conn){
    //...
    conn.sendText(JSON.stringify("Connect Success :)"));
    conn.on("text",function (data) {
        var msg = JSON.parse(data);
        console.log(msg);
        broadcast(data);
    })
}).listen(9000);

function broadcast(msg) {
    server.connections.forEach(function (conn) {
        conn.sendText(msg)
    })
}

console.log("Server starts at 192.168.199.220:9000");