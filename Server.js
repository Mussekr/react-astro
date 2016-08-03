var express = require('express');
var app = express();
var pg = require('pg');
var multer = require('multer');
var Jimp = require("jimp");
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

function createThumbnail(image, mime, maxWidth, maxHeight) {
	return new Promise(function(resolve, reject) {
		Jimp.read(image).then(img => {
			img.scaleToFit(maxWidth, maxHeight, Jimp.RESIZE_BILINEAR);
			img.getBuffer(mime, (err, data) => err ? reject(err) : resolve(data));
		});
	});
}

var config = {
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
var pool =  new pg.Pool(config);

app.use(express.static(__dirname + '/'));

app.get('/api/image/:id', function(req, res) {

	pool.connect(function(err, client, done) {
		if(err) {
			res.status(500).json({success: false, error: err});
		}
		client.query('SELECT image FROM public.images WHERE id = $1', [req.params.id], function (err, result) {
			done();
			if(err) {
				res.status(500).json({success: false, error: err});
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
app.get('/api/image/:id/details', function(req, res) {
  pool.connect(function(err, client, done) {
    if(err) {
      res.status(500).json({success: false, error: err});
      return;
    }
    client.query('SELECT id,name FROM public.images WHERE id = $1', [req.params.id], function(err, result) {
      if(err) {
        res.status(500).json({success: false, error: err});
        return;
      }
      if(result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(500).json({success: false, error: "Image not found!"});
        return;
      }
    });
  });
});
app.get('/api/image/:id/thumbnail', function(re, res) {

});
app.post('/api/login', function(req, res) {
	res.json({success: true});
});

app.post('/api/upload', upload.single('image'), function(req, res) {
	console.log(req.file.buffer);
	console.log(req.body.name);
	pool.connect(function(err, client, done) {
    if(err) {
      res.status(500).json({success: false, error: err});
      return;
    }
    createThumbnail(req.file.buffer, req.file.mimetype, 200, 200).then(thumbnail) => {
      client.query('INSERT INTO public.images (name, image, thumbnail, mimetype) VALUES ($1, $2, $3, $4) RETURNING id', [req.body.name, req.file.buffer, thumbnail, req.file.mimetype], function(err, result) {
        done();
        if(err) {
          res.status(500).json({success: false, error: err});
          return;
        }
        if(result.rowCount > 0) {
          res.json({success: true, id: result.rows[0].id});
				  return;
        } else {
          res.status(500).json({success: false, error: err});
          return;
        }
      });
    }
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
