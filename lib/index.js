var occamsrazor = require('occamsrazor'),
    getFileTraversal = require('./getfiletraversal'),
    getDirTraversal = require('./getdirtraversal'),
    validators = require('./validators');


var getFSTraversal = function (basepath){
    return occamsrazor()
        .add(validators.isDir, getDirTraversal(basepath))
        .add(validators.isFile, getFileTraversal(basepath));
};

module.exports.getFileTraversal = getFileTraversal;
module.exports.getDirTraversal = getDirTraversal;

module.exports.getDirTraversal = getFSTraversal;


module.exports.validators = validators;





