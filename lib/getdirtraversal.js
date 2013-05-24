//
// Directory traversal
//
var getDirTraversal = function (path){

    var DirTraversal = function (req, obj){
        this.req = req;
        this.obj = obj || {path: path, type: 'dir'};
    };

    DirTraversal.prototype.traverse = function (id, cb){
        var newobj = this.obj[id];

        if(typeof newobj !== 'undefined'){
            cb(null, newobj);
        }
        else {
            cb('not found', this.obj);
        }
    };

    DirTraversal.prototype.get = function (cb){
        if(typeof this.obj === 'undefined'){
            cb('undefined');        
        }
        else {
            cb(null, this.obj);
        }
    };

    DirTraversal.prototype.create = function (id, obj, cb){
        this.obj[id] = obj;
        cb(null, id);
    };

    DirTraversal.prototype.update = function (obj, cb){
        this.obj = obj;
        cb(null);
    };

    DirTraversal.prototype.destroy = function (cb){
        delete this.obj;
        cb(null);
    };

    DirTraversal.prototype.list = function (cb){
        cb(null, Object.keys(this.obj));
    };

    return DirTraversal;
};

module.exports = getDirTraversal;

