var occamsrazor = require('occamsrazor'),
    getFileTraversal = require('./getfiletraversal'),
    getDirTraversal = require('./getdirtraversal'),
    validators = require('./validators');

var getFSTraversal = function (basepath){
    return occamsrazor()
        .addNew([occamsrazor.isAnything, validators.isDir], getDirTraversal(basepath))
        .addNew([occamsrazor.isAnything, validators.isFile], getFileTraversal(basepath));
};

module.exports.getFileTraversal = getFileTraversal;
module.exports.getDirTraversal = getDirTraversal;

module.exports.getFSTraversal = getFSTraversal;


module.exports.validators = validators;





