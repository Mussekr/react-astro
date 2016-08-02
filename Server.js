var express = require('express');
var app = express();

app.use(express.static(__dirname + '/'));

app.get('/api/image/:id', function(req, res) {
	res.json({success: true, name: 'NGC 7000'});
});

app.post('/api/login', function(req, res) {
	res.json({success: true});
});

app.listen(process.env.PORT || 8080);
