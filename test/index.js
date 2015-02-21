var chai = require('chai'),
    should = chai.should(),
    assert = chai.assert,
    expect = chai.expect,
    CE = require('../index.js');

describe('__stack', function() {
    it('should create an error stack', function() {
        var err = __stack;
        err.should.be.an('array');
        assert.property(err[0], 'receiver');
    });
});

describe('__line', function() {
    it('should return line number', function() {
        var line = __line;
        line.should.be.a('number');
    });
});

describe('optionalArg', function() {
    it('should choose option over default-value', function() {
        var defaultValue = 'DEFAULT_VALUE',
            options = { someVar: 'USER_VALUE' };
        expect( CE.optionalArg(options, 'someVar', defaultValue) ).to.equal('USER_VALUE');
    });
    it('should choose default-value in case of any error with the user options', function() {
        var defaultValue = 'DEFAULT_VALUE';
        expect( CE.optionalArg(options, 'someVar', defaultValue) ).to.equal('DEFAULT_VALUE');
        var options = {};
        expect( CE.optionalArg(options, 'someVar', defaultValue) ).to.equal('DEFAULT_VALUE');
    });
});

describe('nl2br', function() {
    it('should turn line-break chars into <br> tags', function() {
        var someText = CE.nl2br("a \r\n b \n\r c \n d \r e \r\n\r f \n\r\n g");
        expect(someText).to.be.a('string');
        expect(someText.match(/<br>/g)).to.have.length(8);
    });
});

describe('varDump', function() {
    it('should dump variables data (bojects, strings, numbers etc.)', function() {
        var someVar = {
            a:1,
            b:"text",
            c:[0,1,2]
        };
        var dumped = CE.varDump(someVar, false); // dump for browser with html5 syntax
        expect(dumped).to.be.a('string');
        expect(dumped).to.match(/object/);
        expect(dumped).to.match(/<br>/);
    });
});

describe('tagLog', function() {
    it('please check if logged: [TEST] some test 123', function() {
        CE.tagLog('TEST', 'some test %d', 123);
    });
});

describe('errorLog', function() {
    it('please check if logged: [ERROR] ...stack trace...', function() {
        var err = new Error;
        CE.errorLog(err);
    });
});