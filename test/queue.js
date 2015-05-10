var expect = require('expect.js');
var queue = require('../queue');

describe('queue', function () {
    it('queue.next queue.prev queue.start', function(){
        queue({
            step: 0
        })
        .next(function(next){
            expect(this.step++).to.be(1);
            next();
        })
        .prev(function(next){
            expect(++this.step).to.be(1);
            next();
        })
        .start(function(){
            expect(this.step).to.be(2);
        });
    });
    it('queue.start', function(){
        var num = 0;
        queue().next(function(next){
            expect(num).to.be(0);
            next();
        }).start();
        queue().next(function(next){
            expect(num).to.be(1);
            next();
        }).start(true);
        num++;
    });
    it('queue.proxy queue.clone', function(){
        queue({
            step: 0
        })
        .proxy(function(that){
            expect(this).to.eql(that);
            that.next(function(next){
                expect(this.step++).to.be(1);
                next();
            });
        })
        .proxy(function(that){
            expect(this).to.not.eql(that);
            that.prev(function(next){
                expect(++this.step).to.be(1);
                next();
            })
        }, "x")
        .start(true, function(){
            expect(this.step).to.be(2);
        })
        .clone({step:0}, function(){
            expect(this.step).to.be(2);
        })
        .start();
    });

});