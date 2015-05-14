function Queue(context, done, queues) {
    function Q(err) {
        var args = arguments;
        if (!err) {
            var it = queues.shift();
            if (it) {
                if (args.length)
                    args[0] = Q;
                else
                    args = [Q];
                return it.apply(context, args);
            }
        }
        return done && done.apply(context, args);
    }
    Q.next = function() {
        queues.push.apply(queues, arguments);
        return Q;
    };
    Q.prev = function() {
        queues.unshift.apply(queues, arguments);
        return Q;
    };
    Q.start = function(defer, _done) {
        if (!_done && (typeof defer === 'function')) {
            _done = defer;
            defer = false;
        }
        if (_done)
            done = _done;
        if (defer)
            setTimeout(Q);
        else
            Q(null);
        return Q;
    };
    Q.clone = function(_context, _done, _queues) {
        return Queue(context || _context, done || _done, _queues || queues.slice());
    };
    
    Q.proxy = function(func, ctx) {
        func.call(ctx || Q, Q);
        return Q;
    };
    
    context = context || null;
    done = done || function(){};
    queues = queues || [];
    return Q;
}

module.exports = Queue;
