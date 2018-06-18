WEBURL = "ws://192.168.199.220:9000";
STARTDRAW = 101;
STOPDRAW = 102;
NEWPOINT = 103;
LINEWIDTH = 20;

Panel = {
    state: STOPDRAW
};
Link = {};
Points = {};
ID = Math.random().toString().slice(2);

window.onload = getStart;

function getStart(e){
    getConnect(WEBURL);
    setPanel();
    attachEvent();
}
function getConnect(url) {
    var socket = new WebSocket(url);
    socket.onmessage = function (e){
        var msg = JSON.parse(event.data);
        if(msg.ID !== ID) {
            console.log(msg);
            Link.onmessage(msg);
        }
    };
    Link.send = function (msg) {
        msg.ID = ID;
        socket.send(JSON.stringify(msg));
    }
}
function setPanel(){
    Panel.elem = document.getElementById('panel');
    Panel.ctx = Panel.elem.getContext("2d");
    Panel.ctx.lineCap="round";
    Panel.ctx.lineJoin="round";
    Panel.ctx.lineWidth=LINEWIDTH;
    Panel.ctx.strokeStyle = "#000";
    Panel.ctx.imageSmoothingQuality = "high";
}
function attachEvent() {
    Panel.elem.onmousedown = function (e) {
        addLocalPoint(e.offsetX,e.offsetY);
        Link.send({
            data: STARTDRAW,
            x: e.offsetX,
            y: e.offsetY
        })
    };
    document.onmouseup = function () {
        Panel.state = STOPDRAW;
        Link.send({data: STOPDRAW})
    };
    Panel.elem.onmousemove = function (e) {
        if(Panel.state == STARTDRAW){
            addLocalPoint(e.offsetX,e.offsetY);
            Link.send({
                data: NEWPOINT,
                x: e.offsetX,
                y: e.offsetY
            })
        }
    }
}
Link.onmessage = function (msg) {
    switch (msg.data){
        case STOPDRAW:
            Points[msg.id].state = STOPDRAW;
            break;
        case STARTDRAW:
        case NEWPOINT:
            addWebPoint(msg.id,msg.x,msg.y);
    }
};
function addWebPoint(id, x, y) {
    if(Points[id]){
        var point = Points[id];
        point.point2 = point.state == STOPDRAW ? {x:x,y:y} : point.point1;
        point.state = STARTDRAW;
        point.point1 = {x:x,y:y};
        // Panel.ctx.beginPath();
        Panel.ctx.moveTo(point.point2.x,point.point2.y);
        Panel.ctx.lineTo(x,y);
        Panel.ctx.stroke();
        // Panel.ctx.closePath();
    } else {
        var point = Points[id] = new Point(id,x,y);
        point.point1 = {x:x,y:y};
        point.point2 = point.point1;
        point.state = STARTDRAW;
        // Panel.ctx.beginPath();
        Panel.ctx.moveTo(x,y);
        Panel.ctx.lineTo(x,y);
        Panel.ctx.stroke();
        // Panel.ctx.closePath();
    }
}
function addLocalPoint(x, y) {
    Panel.point2 = Panel.state == STOPDRAW ? {x:x,y:y} : Panel.point1;
    Panel.state = STARTDRAW;
    Panel.point1 = {x:x,y:y};
    // Panel.ctx.beginPath();
    Panel.ctx.moveTo(Panel.point2.x,Panel.point2.y);
    Panel.ctx.lineTo(x,y);
    Panel.ctx.stroke();
    // Panel.ctx.closePath();
}
Point = function (id, x,y) {
    this.id = id;
    this.point1 = {x:x,y:y};
    this.point2 = this.point1;
    this.state = STOPDRAW;
};