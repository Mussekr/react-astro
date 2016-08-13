const express = require('express');
const app = express();
const pg = require('pg');
const multer = require('multer');
const Jimp = require('jimp');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const process = require('process');

function createThumbnail(image, mime, maxWidth, maxHeight) {
  return new Promise(function(resolve, reject) {
    Jimp.read(image).then(img => {
      img.scaleToFit(maxWidth, maxHeight, Jimp.RESIZE_BILINEAR);
      img.getBuffer(mime, (err, data) => err ? reject(err) : resolve(data));
    });
  });
}

const config = {
  max: 20, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  host: process.env.PGHOST || 'localhost'
};
const pool = new pg.Pool(config);

app.use(express.static(__dirname + '/../public/'));
app.get('/api/image/newest', function(req, res) {
  pool.connect(function(err, client, done) {
    if(err) {
      res.status(500).json({success: false, error: err});
      return;
    }
    client.query('SELECT id FROM public.images ORDER BY created DESC LIMIT 5', function (err, result) {
      done();
      if(err) {
        res.status(500).json({success: false, error: err});
      }
      if(result.rows.length > 0) {
        res.json(result.rows);
      }
    });
  });
});
app.get('/api/image/:id', function(req, res) {

  pool.connect(function(err, client, done) {
    if(err) {
      res.status(500).json({success: false, error: err});
      return;
    }
    client.query('SELECT image, mimetype FROM public.images WHERE id = $1', [req.params.id], function (err, result) {
      done();
      if(err) {
        res.status(500).json({success: false, error: err});
        return;
      }

      if(result.rows.length > 0) {
        const img = new Buffer(result.rows[0].image, 'binary');
        res.writeHead(200, {
          'Content-Type': result.rows[0].mimetype,
          'Content-Length': img.length
        });
        res.end(img);
      } else {
        res.json({success: false, error: 'image not found!'});
        return;
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
    client.query('SELECT id,name, mimetype, created FROM public.images WHERE id = $1', [req.params.id], function(err, result) {
      done();
      if(err) {
        res.status(500).json({success: false, error: err});
        return;
      }
      if(result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(500).json({success: false, error: 'Image not found!'});
        return;
      }
    });
  });
});
app.get('/api/image/:id/thumbnail', function(req, res) {
  pool.connect(function(err, client, done) {
    if(err) {
      res.status(500).json({success: false, error: err});
      return;
    }
    client.query('SELECT thumbnail, mimetype FROM public.images WHERE id = $1', [req.params.id], function(err, result) {
      done();
      if(err) {
        res.status(500).json({success: false, error: err});
        return;
      }
      if(result.rows.length > 0) {
        const img = new Buffer(result.rows[0].thumbnail, 'binary');
        res.writeHead(200, {
          'Content-Type': result.rows[0].mimetype,
          'Content-Length': img.length
        });
        res.end(img);
      } else {
        res.status(400).json({success: false, error: 'image not found!'});
      }
    });
  });
});
app.post('/api/login', function(req, res) {
  res.json({success: true});
});

app.post('/api/upload', upload.single('image'), function(req, res) {
  pool.connect(function(err, client, done) {
    if(err) {
      res.status(500).json({success: false, error: err});
      return;
    }
    createThumbnail(req.file.buffer, req.file.mimetype, 200, 200).then(thumbnail => {
      client.query(
        'INSERT INTO public.images (name, image, thumbnail, mimetype, created) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id',
        [req.body.name, req.file.buffer, thumbnail, req.file.mimetype], function(err, result) {
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
    });
  });
});

//placeholder form
const content = '<html><body><form method="post" enctype="multipart/form-data" action="/api/upload"> ' +
  '<p><input type="text" name="name" placeholder="Name" /></p><p><input type="file" name="image" /></p>' +
  '<p><input type="submit" /></body></html>';
app.get('/api/upload', function(req, res) {
  res.send(content);
});

app.listen(process.env.PORT || 8080);

pool.on('error', function (err, client) {

  console.error('idle client error', err.message, err.stack, client);
});
