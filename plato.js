var plato = require('plato');

var files = [
  'lib/player.js',
  'lib/muxer.js'
];

var outputDir = './output';

var options = {
  title: 'Your title here'
};

var callback = function (report){
  console.log(JSON.stringify(report, null, 4));
};

plato.inspect(files, outputDir, {}, callback);