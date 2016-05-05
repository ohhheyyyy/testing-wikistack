var expect = require('chai').expect;
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);

// Simple Test
describe("calculation", function() {
    it("confirms basic arithmetic", function() {
        expect(2 + 2).to.be.equal(4);
    });
});

// Asynchronous
describe("asynchronous function", function() {
    it("confirms setTimeout\'s timer accuracy", function(done) {
        var start = new Date();
        setTimeout(function() {
            var duration = new Date() - start;
            expect(duration).to.be.closeTo(1000, 50);
            // will pass if duration = 950 to 1050 ms
            done();
        }, 1000);
    });
});

// Spy
// confirm that: forEach will invoke its 
// function once for every element.

describe("Spy", function() {
    it("will invoke a function once per element", function() {
        var arr = ['x', 'y', 'z'];

        function logNth(value, index) {
            console.log('Logging element #' + index + ': ', value);
        }
        logNth = chai.spy(logNth);
        arr.forEach(logNth);
        expect(logNth).to.have.been.called.exactly(arr.length);
    });
});

// Confirmation Bias
describe("Confirmation Bias", function() {
    it ("actually asserts the result we're looking for", function() {
            function largerNum(a, b) {
                if (a < b) {
                    return b;
                } else {
                    return a;
                }
            }
            expect(largerNum(3, 4)).to.be.equal(4);
        });
});


