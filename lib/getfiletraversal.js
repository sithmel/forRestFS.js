//
// Generic file traversal
//

var FileTraversal = function (req, obj){
    this.req = req;
    this.obj = obj || {path: path, type: 'dir'};
};

FileTraversal.prototype.traverse = function (id, cb){
    var newobj = this.obj[id];

    if(typeof newobj !== 'undefined'){
        cb(null, newobj);
    }
    else {
        cb('not found', this.obj);
    }
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
    this.obj[id] = obj;
    cb(null, id);
};

FileTraversal.prototype.update = function (obj, cb){
    this.obj = obj;
    cb(null);
};

FileTraversal.prototype.destroy = function (cb){
    delete this.obj;
    cb(null);
};

FileTraversal.prototype.list = function (cb){
    cb(null, Object.keys(this.obj));
};

module.exports = function (){
    return FileTraversal;
};


