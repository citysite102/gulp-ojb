var through = require('through2');
var gutil = require('gulp-util');
var RNCryptor = require('jscryptor');
var Error = gutil.PluginError;

const PLUGIN_NAME = 'gulp-encrypt';

// The main process
function encrypt(password) {
    
    return through.obj(function(file, encoding, callback){
        
        if (!password) {
            this.emit('error', new Error(PLUGIN_NAME, 'the password is not defined'));
        }
        
        if (file.isNull()) {
            return callback(null, file);
        }
        
        if (file.isStream()) {
            // emit error since the stream type is not supported yet
            this.emit('error', new Error(PLUGIN_NAME, 'Streaming is not supported'))
        }
        
        gutil.log('start encrypt file: ' + file.path);
        var encrypted = RNCryptor.Encrypt(file.contents.toString(), password);
        file.contents = new Buffer(encrypted, 'base64');
        
        return callback(null, file);
    });
}

module.exports = encrypt;