var express = require('express');
var app = express();
var pg = require('pg');

var config = {
  user: 'postgres', //env var: PGUSER
  database: 'astrogallery', //env var: PGDATABASE
  password: 'root', //env var: PGPASSWORD
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

var pool =  new pg.Pool(config);

app.use(express.static(__dirname + '/'));

app.get('/api/image/:id', function(req, res) {

	pool.connect(function(err, client, done) {
		if(err) {
			res.json({success: false, error: err});
		}
		client.query('SELECT encode(image, 'base64') as image FROM public.images WHERE id = $1', [req.params.id], function (err, result) {

			done();

			if(err) {
				res.json({success: false, error: err});
			}
			res.json(result.rows[0].image);
			console.log(result.rows[0].image);
			/*var img = new Buffer(result.rows[0], 'base64');
			res.writeHead(200, {
				'Content-Type': 'image/png',
				'Content-Length': img.length
			});
			res.end(img);*/
		});
	});


});

app.post('/api/login', function(req, res) {
	res.json({success: true});
});

app.listen(process.env.PORT || 8080);

pool.on('error', function (err, client) {

  console.error('idle client error', err.message, err.stack)
})
