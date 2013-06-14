var path = require('path'),
    fs   = require('fs');


var list2objects = function (basepath, objpath, files, callback){
    var objects = [];
    (function getObject(f){
        if (!f){
            return callback(null, objects);
        }

        fs.stat(path.join(basepath, objpath, f), function (err, stat){
            if (err){
                return callback(err);
            }
            
            if (stat.isFile()){
               objects.push({
                   type: 'file',
                   path: path.join(objpath, f)
               }); 
            }
            else if (stat.isDirectory()){
               objects.push({
                   type: 'directory',
                   path: path.join(objpath, f)
               }); 

            }
            getObject(files.shift());
        });
    }(files.shift()));
};


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
                    fs.readFile(full_path, 'utf8', function (err, data){
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
        return this.obj;
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

    DirTraversal.prototype.destroy = function (id, cb){
        var full_path = path.join(basepath, this.obj.path, id);
        fs.stat(full_path, function (err, stat){
            if (stat.isFile()){
                fs.unlink(full_path, cb);
            }
            else if (stat.isDirectory()){
                // check if the directory is empty ?
                fs.rmdir(full_path, cb);
            }
        });
        
    };


    DirTraversal.prototype.query = function (opt, cb){
        var p = path.join(basepath, this.obj.path),
            objpath = this.obj.path;
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
                list2objects(basepath, objpath, files, cb);
            });
        });
    };

    return DirTraversal;
};

module.exports = getDirTraversal;

