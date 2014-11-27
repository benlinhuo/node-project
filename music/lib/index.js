//主程序
exports.App = require('./fw');

//中间件
exports.redirect = require('./middleware/redirect');

exports.midstatic = require('./middleware/static');

exports.download = require('./middleware/download');

exports.json = require('./middleware/json');

exports.param = require('./middleware/param');

exports.post = require('./middleware/post');