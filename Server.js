var express = require('express');
var app = express();
var pg = require('pg');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

var config = {
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
		client.query('SELECT image FROM public.images WHERE id = $1', [req.params.id], function (err, result) {

			done();

			if(err) {
				res.json({success: false, error: err});
			}

			if(result.rows.length > 0) {
				var img = new Buffer(result.rows[0].image, 'binary');
				res.writeHead(200, {
					'Content-Type': 'image/jpeg',
					'Content-Length': img.length
				});
				res.end(img);
			} else {
				res.json({success: false, error: "image not found!"});
			}
		});
	});


});

app.post('/api/login', function(req, res) {
	res.json({success: true});
});

app.post('/api/upload', upload.single('image'), function(req, res) {
	console.log(req.file.buffer);
	console.log(req.body.name);
	pool.connect(function(err, client, done) {
		if(err) {
			res.json({success: false});
		}
		client.query('INSERT INTO images (name, image) VALUES ($1, $2)', [req.body.name], [req.file.buffer], function(err, result) {
			done();
			if(err) {
				res.json({success: false});
			}
			if(result.rows.length > 0) {
				res.json({success: true});
			} else {
				res.json({success: false});
			}
		});
	});
});

//placeholder form
var content = '<html><body><form method="post" enctype="multipart/form-data" action="/api/upload"><p><input type="text" name="name" placeholder="Name" /></p><p><input type="file" name="image" /></p><p><input type="submit" /></body></html>';
app.get('/api/upload', function(req, res) {
	res.send(content);
});

app.listen(process.env.PORT || 8080);

pool.on('error', function (err, client) {

  console.error('idle client error', err.message, err.stack)
})
