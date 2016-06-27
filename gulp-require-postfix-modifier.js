var through = require('through2');
var gutil = require('gulp-util');
var Error = gutil.PluginError;

const PLUGIN_NAME = 'gulp-update-requires';
const REQUIRE_REGEX = /^var\s+(\w+)\s+\=\s+require\((\"|\')[\w\.\/\_\-]+\w+(\"|\')\);?\s*\n?$/;

// The main stream process

function requirePostfixUpdator(newPostfix) {
    
    return through.obj(function(file, encoding, callback) {
        
        if (!newPostfix) {
            this.emit('error', new Error(PLUGIN_NAME, 'the postfix is not defined'));
        }
        
        if (file.isNull()) {
            // simply return the empty file
            this.push(file);
            return callback();
        }
        
        if (file.isStream()) {
            // emit error since the stream type is not supported
            this.emit('error', new Error(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }
        
        gutil.log(gutil.colors.magenta('start update require statements with file: ' + file.path));
        gutil.log(gutil.colors.magenta('start update require statements with postfix: ' + newPostfix));
        var buffers = file.contents.toString().split('\n').map((line) => {
            if (line.match(REQUIRE_REGEX)) {
                line = line.replace(/(\.)(\w+)([\"|\'])/, '$1' + newPostfix + '$3');
            }
            return new Buffer(line + '\n');
        });
        
        file.contents = Buffer.concat(buffers);
        // this.push(file);
        callback();
    })
}

module.exports = requirePostfixUpdator;