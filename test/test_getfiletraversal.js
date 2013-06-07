// install mocha and should.js to get the test run 
// sudo npm -g install mocha
// sudo npm -g install should
//
// run with "mocha"

var should = require('should'),
    fs = require('fs'),
    path = require('path'),
    rmtree = require('./rmtree'),
    testpath = __dirname,
    filetest = path.join(testpath, "filetest"),
    getFileTraversal = require('../lib/getfiletraversal'),
    rootobj = {type: 'file', path: "filetest"},
    fileTraversal = getFileTraversal(testpath);



describe('filetraversal', function(){

    before(function(done){
        fs.writeFileSync(filetest, "data", 'utf8');
        done();
    });

    after(function(done){
        try {
            fs.unlinkSync(filetest);
        }
        catch (err){
        }
        done();
    });


    it('it is defined', function(){
        should.exist(fileTraversal);
    });

    it('new traversal', function(){
        var t = new fileTraversal(null, rootobj);
        should.exist(t);
    });

});


describe('filetraversal operations', function(){

    var t = new fileTraversal(null, rootobj);

    before(function(done){
        fs.writeFileSync(filetest, "data", 'utf8');
        done();
    });

    after(function(done){
        try {
            fs.unlinkSync(filetest);
        }
        catch (err){
        }
        done();
    });

    it('returns object', function(){
        t.get(function (err, obj){
            obj.type.should.be.equal('file');
            obj.path.should.be.equal('filetest');
        
        });
        should.exist(t);
    });

    // cannot list
    it('list', function(){
        t.list(function (err, files){
            should.exist(err);
        });
    });

    // cannot create
    it('create dir', function(){
        t.create('testdir', {type: 'directory'}, function (err, id){
            should.exist(err);
        });
    });


    // cannot traverse
    it('traverse', function(){
        // dir obj
        t.traverse('subdir', function (err, obj){
            should.exist(err);
        });

    });
    
    it('update', function(){
        t.update('test', function (err){
            var s = fs.writeFileSync(filetest, 'utf8');
            s.should.be("test");
        });
    });

    it('destroy', function(){
        t.destroy(function (err){
            var exists = fs.existsSync(filetest);
            exists.should.be.false;
        });
    });


});





