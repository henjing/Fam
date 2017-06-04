var nunjucks = require('nunjucks');
var isProduction = process.env.NODE_ENV === 'production';

function createEnv(path, opts) {
    var
        autoescape = opts.autoescape && true,
        noCache = opts.noCache || false,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader('views', {
                noCache: noCache,
                watch: watch,
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            });
    if (opts.filters) {
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}

module.exports = function (response, view, data) {
    var env = createEnv('views', {
        watch: true,
        noCache: isProduction,
        filters: {
            hex: function (n) {
                return '0x' + n.toString(16);
            }
        }
    });
    
    function render() {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(env.render(view, data || {}));
    }
    
    return render();
}

