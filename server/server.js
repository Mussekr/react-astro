const express = require('express');
const app = express();
const pg = require('pg');
const multer = require('multer');
const Jimp = require('jimp');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const process = require('process');
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));

function createThumbnail(image, mime, maxWidth, maxHeight) {
  return new Promise(function(resolve, reject) {
    Jimp.read(image).then(img => {
      img.scaleToFit(maxWidth, maxHeight, Jimp.RESIZE_BILINEAR);
      img.getBuffer(mime, (err, data) => err ? reject(err) : resolve(data));
    });
  });
}
function addBcryptType(err) {
  err.type = 'bcryptError';
  throw err;
}
const config = {
  max: 20, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  host: process.env.PGHOST || 'localhost'
};
const pool = new pg.Pool(config);

passport.use(
  'local-login',
  new LocalStrategy({
    usernameField: 'username',
    passwordField: 'pwd',
    passReqToCallback: true
  },
  function(req, username, password, done) {
    pool.connect(function(err, client, doneSql) {
      if(err) {
        return done(err);
      }
      client.query('SELECT * FROM public.users WHERE username = $1', [username], function(err, result) {
        doneSql();
        if(err) {
          return done(err);
        }
        if(!result.rows.length) {
          return done(null, false, {message: 'Wrong username/password! Try again!'});
        }
        Promise.try(function() {
          return bcrypt.compareAsync(password, result.rows[0].password).catch(addBcryptType);
        }).then(function(valid) {
          if(valid) {
            return done(null, result.rows[0]);
          } else {
            return done(null, false, {message: 'Wrong username/password! Try again!'});
          }
        });
      });
    });
  })
);

app.use(express.static(__dirname + '/../public/'));
app.get('/api/image/newest', function(req, res) {
  pool.connect(function(err, client, done) {
    if(err) {
      res.status(500).json({success: false, error: err});
      return;
    }
    client.query('SELECT images.id, images.name, images.created, users.username FROM images' +
    ' INNER JOIN users ON images.userid=users.id ORDER BY images.created DESC LIMIT 5;', function (err, result) {
      done();
      if(err) {
        res.status(500).json({success: false, error: err});
      }
      if(result.rows.length > 0) {
        res.json(result.rows);
      } else {
        res.json({});
        return;
      }
    });
  });
});
app.get('/api/generatehash/:password', function(req, res) {
  Promise.try(function() {
    return bcrypt.hashAsync(req.params.password, 10).catch(addBcryptType);
  }).then(function(hash) {
    res.json({password: req.params.password, hahs: hash});
  });
});
app.get('/api/testpassword/:password/:hash', function(req, res) {
  Promise.try(function() {
    return bcrypt.compareAsync(req.params.password, req.params.hash).catch(addBcryptType);
  }).then(function(valid) {
    if(valid) {
      res.json({success: true});
      return;
    } else {
      res.json({success: false});
      return;
    }
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
        res.status(404).json({success: false, error: 'image not found!'});
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
        res.status(404).json({success: false, error: 'Image not found!'});
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
        res.status(404).json({success: false, error: 'image not found!'});
      }
    });
  });
});
app.get('/api/categories', function(req, res) {
  pool.connect(function(err, client, done) {
    if(err) {
      res.status(500).json({success: false, error: err});
      return;
    }
    client.query('SELECT * FROM Categories', function(err, result) {
      done();
      if(err) {
        res.status(500).json({success: false, error: err});
        return;
      }
      if(result.rows.length > 0) {
        res.json(result.rows);
      } else {
        res.json({});
      }
    });
  });
});
const placeholderLoginForm = '<html><body><form action="/api/login" method="post">' +
'<p><input type="text" name="username" placeholder="Username" /></p>' +
'<p><input type="password" name="pwd" placeholder="Password" /></p><p><input type="submit" /></form></body></html>';
app.get('/api/login', function(req, res) {
  res.send(placeholderLoginForm);
});
app.post('/api/login', function(req, res, next) {
  passport.authenticate('local-login', function(err, user, info) {
    if(err) {
      return next(err);
    }
    if(!user) {
      return res.json({success: false, error: 'Wrong username/password!'});
    }
    req.logIn(user, function(err) {
      if(err) {
        return next(err);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});
const registerForm = '<html><body><form action="/api/register" method="post"><input type="text" name="username" placeholder="username" />' +
'<input type="password" name="password" placeholder="Password" /><input type="submit" /></form></body></html>';
app.get('/api/register', function(req, res) {
  res.send(registerForm);
});
app.post('/api/register', function(req, res) {
  Promise.try(function() {
    return bcrypt.hashAsync(req.body.password, 19).catch(addBcryptType);
  }).then(function(hash) {
    pool.connect(function(err, client, done) {
      if(err) {
        res.status(500).json({success: false, error: err});
        return;
      }
      client.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', [req.body.username, hash, 0], function(err, result) {
        done();
        if(err) {
          res.status(500).json({success: false, error: err});
          return;
        }
        if(result.rowCount > 0) {
          res.json({success: true});
          return;
        } else {
          res.json({success: false});
          return;
        }
      });
    });
  });
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
