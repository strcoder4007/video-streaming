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

//ffmpeg -re -i video.mp4 -c copy -flags +global_header -f flv rtmp://video-center-sg.alivecdn.com/AppName/StreamName?vhost=livevideo.wearexenon.com

app.use(function(req, res) {

    var command = spawn('ffmpeg', ['-re', '-i', '../video.mp4', '-c', 'copy', '-flags', '+global_header', '-f', 'flv', 'rtmp://video-center-sg.alivecdn.com/AppName/StreamName?vhost=livevideo.wearexenon.com']);
    // input_file.pipe(ffmpeg.stdin);
    // ffmpeg.stdout.pipe(output_stream);

    command.stderr.on('data', function (data) {
        console.log(data.toString());
    });

    command.stderr.on('end', function () {
        console.log('file has been converted successfully');
    });

    command.stderr.on('exit', function () {
        console.log('child process exited');
    });

    command.stderr.on('close', function() {
        console.log('...closing time! bye');
    });

});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const port = process.env.PORT || '3000';
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));