var ws = require("nodejs-websocket");

var server = ws.createServer(function (conn){
    //...
    conn.sendText(JSON.stringify("Connect Success :)"));
    conn.on("text",function (data) {
        var msg = JSON.parse(data);
        // console.log(msg);
        broadcast(data);
    });
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    });
    conn.on("error",function (err) {
        console.error(err);
        conn.close()
    });
    console.log("New connection")
}).listen(9000);

function broadcast(msg) {
    server.connections.forEach(function (conn) {
        conn.sendText(msg)
    })
}

console.log("Server starts at 192.168.199.220:9000");