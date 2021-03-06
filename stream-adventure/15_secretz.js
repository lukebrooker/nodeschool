var crypto = require('crypto');
var decrypt = crypto.createDecipher(process.argv[2], process.argv[3]);
var gunzip = require('zlib').createGunzip();
var through = require('through');

var tar = require('tar');
var parser = tar.Parse();
parser.on('entry', function (e) {
    if (e.type !== 'File') return;
    
    var hash = crypto.createHash('md5', { encoding: 'hex' });
    e.pipe(hash).pipe(through(null, end)).pipe(process.stdout);
    
    function end () { 
      this.queue(' ' + e.path + '\n'); 
    }
});

process.stdin
  .pipe(decrypt)
  .pipe(gunzip)
  .pipe(parser);
