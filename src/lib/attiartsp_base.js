function getQueryParams() {
    var qs = document.location.search;
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}
var urlParams = getQueryParams();
const players = {};
const sockets = {};
var baseUrl = window.streamServerBaseUrl ? streamServerBaseUrl : "";
function connectStreamWS(element, config) {
    
    $.post(baseUrl+"/startStream", config, function (data) {
        if (data.status != 'OK') {
            return;
        }
        //start socket.io client connection
        sockets[data.feedId.toString()] = io(baseUrl);
        //on socket.io connection success
        sockets[data.feedId.toString()].on('connect', function () {
            //pretend this is the command you use to initiate getting H.264 (MPEG) data
            sockets[data.feedId.toString()].emit('f', { function: 'getStream', feed: data.feedId })
        })
        var canvas = document.getElementById(element);
        // initiate a player that can be piped to.
        var instance = new Stream();
        players[data.feedId.toString()] = new instance.Player('pipe', {
            canvas: canvas
        });
        //on data from "h264" handle
        sockets[data.feedId.toString()].on('h264', function (data) {
            players[data.feed].write(data.buffer, function(){});
        });
        // on data error
        sockets[data.feedId.toString()].on('h264-error', function (data) {
            console.log("error received from server", data.message);
        });
    });
    
    // $("#" + element)[0].webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT); //Chrome
    $("#" + element + "Enlarge").click(function () {
        var el = document.getElementById(element);
        el.webkitRequestFullScreen();
    });
}

function connectStreamHTTP(element, config) {
    $.post(baseUrl+"/startStream", config, function (data) {
        if (data.status != 'OK') {
            return;
        }
        players[data.feedId] = flvjs.createPlayer({
            type: 'flv',
            isLive: true,
            url: baseUrl+'/flv/' + data.feedId
        });


        players[data.feedId].attachMediaElement(document.getElementById(element));
        players[data.feedId].on('error', function (err) {
            console.log(err)
        });
        players[data.feedId].load();
        players[data.feedId].play();
        players[data.feedId].on("STATISTICS_INFO", function (data) {
            console.log(data.feedId, data);
        })
    });
    $("#" + element + "Enlarge").click(function () {
        var el = document.getElementById(element);
        el.webkitRequestFullScreen();
    });
}