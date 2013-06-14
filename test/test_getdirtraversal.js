// install mocha and should.js to get the test run 
// sudo npm -g install mocha
// sudo npm -g install should
//
// run with "mocha"

var should = require('should'),
    fs = require('fs'),
    path = require('path'),
    rmtree = require('./rmtree'),
    testpath = path.join(__dirname, "dirtest"),
    getDirTraversal = require('../lib/getdirtraversal'),
    rootobj = {type: 'directory', path: "root"},
    dirTraversal = getDirTraversal(testpath);



describe('dirtraversal', function(){

    before(function(done){
        rmtree(testpath);
        fs.mkdirSync(testpath);
        fs.mkdirSync(path.join(testpath, "root"));
        fs.mkdirSync(path.join(testpath, "root", "subdir"));
        done();
    });

    after(function(done){
        rmtree(testpath);
        done();
    });


    it('it is defined', function(){
        should.exist(dirTraversal);
    });

    it('new traversal', function(){
        var t = new dirTraversal(null, rootobj);
        should.exist(t);
    });

});


describe('dirtraversal operations', function(){

    var t = new dirTraversal(null, rootobj);

    before(function(done){
        rmtree(testpath);
        fs.mkdirSync(testpath);
        fs.mkdirSync(path.join(testpath, "root"));
        fs.writeFileSync(path.join(testpath, "root", 'subfile'), 'data');
        fs.writeFileSync(path.join(testpath, "root", 'subfile.json'), '{"type": "json"}', 'utf8');
        
        fs.mkdirSync(path.join(testpath, "root", "subdir"));
        done();
    });

    after(function(done){
        rmtree(testpath);
        done();
    });


    it('returns object', function(){
        var obj = t.get();
        should.exist(t);
        obj.type.should.be.equal('directory');
        obj.path.should.be.equal('root');
    });

    it('query', function(){
        t.query({}, function (err, objs){
            console.log(objs);
            objs.should.include({ type: 'file', path: 'root/subfile' });
//            files.should.include('subfile');
//            files.should.include('subfile.json');
//            files.should.have.length(3);
        });
    });

    it('create dir', function(){
        t.create('testdir', {type: 'directory'}, function (err, id){
            var fpath = path.join(testpath, 'root', 'testdir');
            should.not.exist(err);
            id.should.equal('testdir');
            
            fs.existsSync(fpath).should.be.true;
            var stat = fs.statSync(fpath);
            stat.isDirectory().should.be.true;
            t.create('testdir', {type: 'directory'}, function (err, id){
                should.exist(err);
            });

        
        });
    });

    it('create file', function(){
        t.create('testfile', 'data', function (err, id){
            var fpath = path.join(testpath, 'root', 'testfile');
            should.not.exist(err);
            id.should.equal('testfile');

            var exists = fs.existsSync(fpath);
            exists.should.be.true;

            var stat = fs.statSync(fpath),
                isFile = stat.isFile();

            isFile.should.be.true;

            var content = fs.readFileSync(fpath, 'ascii');

            content.should.be.equal("data");

            t.create('testfile', {type: 'directory'}, function (err, id){
                should.exist(err);
            });
            t.create('testfile', "data", function (err, id){
                should.exist(err);
            });
        
        });
    });

    it('update', function(){
        t.update('test', function (err){
            should.exist(err);
        });
    });

    it('traverse', function(){
        // dir obj
        t.traverse('subdir', function (err, obj){
            obj.type.should.equal('directory');
            obj.path.should.equal('root/subdir');
        });

        // not exists
        t.traverse('subdir_not_existent', function (err, obj){
            should.exist(err);
        });

        // file obj
        t.traverse('subfile', function (err, obj){
            obj.type.should.equal('file');
            obj.path.should.equal('root/subfile');
        });

        // json object
        t.traverse('subfile.json', function (err, obj){
            obj.type.should.equal('json');
        });

    });

    it('destroy', function(){
        t.destroy('subfile', function (err){
            should.not.exist(err);
            var exists = fs.existsSync(path.join(testpath, "root", "subfile"));
            exists.should.be.false;
        });
    });

});



