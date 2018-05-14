const fs = require('fs');
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const router = express.Router();
const spawn = require('child_process').spawn;
var ffmpeg = require('fluent-ffmpeg');

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//ffmpeg -i /dev/video0 -framerate 60 -video_size 640x480 out.mkv
//ffmpeg -re -i video.mp4 -c copy -flags +global_header -f flv rtmp://video-center-sg.alivecdn.com/AppName/StreamName?vhost=livevideo.wearexenon.com

var getWebCam = spawn('ffmpeg', ['-i', '/dev/video0', '-framerate', '30', '-video_size', '320x240', 'out.mkv']);
// input_file.pipe(ffmpeg.stdin);
// ffmpeg.stdout.pipe(output_stream);
getWebCam.stderr.on('data', function (data) {
    console.log(data.toString());
});
getWebCam.stderr.on('end', function () {
    console.log('webcam stopped!');
});
getWebCam.stderr.on('exit', function () {
    console.log('child process exited');
});
getWebCam.stderr.on('close', function() {
    console.log('...closing time! bye');
});


var pushStream = spawn('ffmpeg', ['-re', '-i', 'out.mkv', '-c', 'copy', '-flags', '+global_header', '-f', 'flv', 'rtmp://video-center-sg.alivecdn.com/AppName/StreamName?vhost=livevideo.wearexenon.com']);
// input_file.pipe(ffmpeg.stdin);
// ffmpeg.stdout.pipe(output_stream);
pushStream.stderr.on('data', function (data) {
    console.log(data.toString());
});
pushStream.stderr.on('end', function () {
    console.log('file has been converted succesfully');
});
pushStream.stderr.on('exit', function () {
    console.log('child process exited');
});
pushStream.stderr.on('close', function() {
    console.log('...closing time! bye');
});



app.use(function(req, res) {

});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const port = process.env.PORT || '3000';
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));