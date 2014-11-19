var cheerio = require('cheerio');

$ = cheerio.load('<li>pear</li><li>apple</li>');
console.log($('li').length);
