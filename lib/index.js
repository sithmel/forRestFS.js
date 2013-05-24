var occamsrazor = require('occamsrazor'),
    getFileTraversal = require('./getfiletraversal'),
    getDirTraversal = require('./getdirtraversal'),
    validators = require('./validators');


var getFSTraversal = function (path){

//
// setting up components
//

    var DirTraversal = getDirTraversal(path), // init traversals
        FileTraversal = getFileTraversal(), // init traversals
        Traversal = occamsrazor()
    .add(validators.isDir, DirTraversal)
    .add(validators.isFile, FileTraversal);

    return new Traversal({type: 'directory', path: path});
};

module.exports.getFSTraversal = getFSTraversal;

module.exports.validators = validators;







