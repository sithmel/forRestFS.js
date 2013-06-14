var path = require('path'),
    fs   = require('fs');


//
// Generic file traversal
//
var getFileTraversal = function (basepath){

    var FileTraversal = function (req, obj){
        this.req = req;
        this.obj = obj;
    };

    FileTraversal.prototype.traverse = function (id, cb){
        cb('cannot traverse');
    };

    FileTraversal.prototype.get = function (){
        return this.obj;
    };

    FileTraversal.prototype.create = function (id, obj, cb){
        cb('cannot create');
    };

    FileTraversal.prototype.update = function (data, cb){
        var fullpath = path.join(basepath, this.obj.path);

        fs.stat(fullpath, function (err, stat){
            if (err){
                return cb(err);
            }
            else if (!stat.isFile()){
                return cb("This is not a file. You can't update");
            }
            else {
                fs.writeFile(fullpath, data , function (err) {
                    if (err){
                        return cb("Cannot create file here");
                    }
                    else {
                        return cb(null);
                    }
                });
            }
        });

    };

    FileTraversal.prototype.destroy = function (id, cb){
        cb('cannot delete');
    };

    FileTraversal.prototype.query = function (opt, cb){
        cb('cannot list');
    };
    
    return FileTraversal;
};

module.exports =  getFileTraversal;


