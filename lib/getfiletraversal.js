var path = require('path'),
    fs   = require('fs'),
    getFSObj = require('./getfsobj');


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

    FileTraversal.prototype.get = function (cb){
        if(typeof this.obj === 'undefined'){
            cb('undefined');        
        }
        else {
            cb(null, this.obj);
        }
    };

    FileTraversal.prototype.create = function (id, obj, cb){
        cb('cannot create');
    };

    FileTraversal.prototype.update = function (data, cb){
        var fullpath = path.join(basepath, obj.path);

        fs.stat(fullpath, function (err, stat){
            if (err){
                return cb(err);
            }
            else if (!stat.isFile()){
                return cb("This is not a file. You can't update");
            }
            else {
                fs.writeFile(full_path, data.content , function (err) {
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

    FileTraversal.prototype.destroy = function (cb){
        var fullpath = path.join(basepath, obj.path);
        fs.unlink(fullpath, cb);
        delete this.obj;        
    };

    FileTraversal.prototype.list = function (cb){
        cb('cannot list');
    };
    
    return FileTraversal;
};

module.exports =  getFileTraversal;


