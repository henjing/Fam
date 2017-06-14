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

/* *
 * @param {object} req
 * @param {object} res
 * @param {string} view 页面模板，如index.html
 * @param {object} data 返回给页面模板的数据
 * 
 * */
module.exports = function (req, res) {
    
    var env = createEnv('views', {
        watch: true,
        noCache: isProduction,
        filters: {
            hex: function (n) {
                return '0x' + n.toString(16);
            }
        }
    });
    
    req.render = function render(view, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(env.render(view, data || {}));
    }
}



