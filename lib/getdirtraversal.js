var path = require('path'),
    fs   = require('fs');

//
// Directory traversal
//
var getDirTraversal = function (basepath){

    var DirTraversal = function (req, obj){
        this.req = req;
        this.obj = obj;
    };

    DirTraversal.prototype.traverse = function (id, cb){
        var rel_path  = path.join(this.obj.path, id),
            full_path = path.join(basepath, rel_path);
        
        fs.stat(full_path, function (err, stat){
            if (err){
                return cb(err);
            }
            else if (stat.isDirectory()){
                return cb(null, {
                    type: 'directory',
                    path: rel_path
                });
            }
            else if (stat.isFile()){
                if (path.extname(id).toLowerCase() === '.json'){
                    fs.readFile(full_path, function (err, data){
                        var obj;
                        if (err){
                            return cb(err);
                        }
                        else {
                            try {
                                obj = JSON.parse(data);
                                return cb(null, obj);
                            }
                            catch (e) {
                                return cb("Wrong json format");
                            }
                        }
                    });
                }
                else {
                    return cb(null, {
                        type: 'file',
                        path: rel_path
                    });
                }
                
            }
            else {
                return cb('not a file or directory');
            }
        });
    };

    DirTraversal.prototype.get = function (cb){
        if(typeof this.obj === 'undefined'){
            cb('undefined');        
        }
        else {
            cb(null, this.obj);
        }
    };

    // TODO: if necessary I should change the id
    // TODO: data should be a stream
    DirTraversal.prototype.create = function (id, data, cb){
        var rel_path  = path.join(this.obj.path, id),
            full_path = path.join(basepath, rel_path);
        
        // check if id exists
        fs.exists(full_path, function (exists){
            if (exists){
                return cb('The resource ' + id + ' exists in this folder')
            }
            else {
                if (typeof data.type !== 'undefined' && data.type === "directory"){
                    fs.mkdir(full_path, function (err){
                        if (err){
                            return cb("Cannot create directory here");
                        }
                        else {
                            return cb(null, id);
                        }
                    });
                }
                else { // should I use a view to put the data in ?
                    fs.writeFile(full_path, data , function (err) {
                        if (err){
                            return cb("Cannot create file here");
                        }
                        else {
                            return cb(null, id);
                        }
                    });
                }
            }
        });
    };

    DirTraversal.prototype.update = function (obj, cb){
        cb("You can't update a directory");
    };

    DirTraversal.prototype.destroy = function (cb){
        var full_path = path.join(basepath, this.obj.path);

        // check if the directory is empty ?
        delete this.obj;
        fs.rmdir(full_path, cb);
    };

    DirTraversal.prototype.list = function (cb){
        var p = path.join(basepath, this.obj.path);
        fs.stat(p, function (err, stat){
            if (err){
                return cb(err);
            }
            else if (!stat.isDirectory()){
                return cb('not a valid directory');
            }
            fs.readdir(p, function (err, files){
                if (err){
                    return cb(err);
                }
                cb(null, files);
            });
        });
    };

    return DirTraversal;
};

module.exports = getDirTraversal;

