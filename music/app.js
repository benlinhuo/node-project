var fw = require('./lib');
	app = new fw.App(),
	redirect = fw.redirect;

app.use(redirect);

//让“／”重定向到"/views/index.html"
app.get('/', function(req, res) {
	res.redirect('views/index.html');
});

//redirect
app.get('/views/index.html', function(req, res) {
	
});
