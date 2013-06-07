var occamsrazor = require('occamsrazor'),
    fs = require('fs');

var hasPath = function (obj){
     return path in obj;
};

module.exports.hasPath = hasPath;

module.exports.isDir = occamsrazor.chain(hasPath, function (obj){
    return type in obj && type === "directory";
});

module.exports.isFile = occamsrazor.chain(hasPath, function (obj){
    return type in obj && type === "file";
});


