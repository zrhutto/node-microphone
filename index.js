var isMacOrWin = require('os').type() == 'Darwin' || require('os').type().indexOf('Windows') > -1;
var spawn = require('child_process').spawn
var PassThrough = require('stream').PassThrough;

var ps = null;

var audio = new PassThrough;
var info = new PassThrough;

var start = function(options) {
    options = options || {},
    device = options.device || 'plughw:1,0';
    
    if(ps == null) {
        ps = isMacOrWin
        ? spawn('sox', ['-d', '-t', 'dat', '-p'])
        : spawn('arecord', ['-D', device, '-f', 'dat']);

        if(options.mp3output === true) {
            console.err("MP3 output has been removed");
        } else {
            ps.stdout.pipe(audio);
            ps.stderr.pipe(info);

        }
    }
};

var stop = function() {
    if(ps) {
        ps.kill();
        ps = null;
    }
};

exports.audioStream = audio;
exports.infoStream = info;
exports.startCapture = start;
exports.stopCapture = stop;
