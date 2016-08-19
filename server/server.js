const express = require('express');
const app = express();
const pg = require('pg');
const multer = require('multer');
const Jimp = require('jimp');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const process = require('process');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));
const Authentication = require('./Authentication');
const ensureLogin = require('connect-ensure-login');
const bodyParser = require('body-parser');
const session = require('express-session');
const serverConfig = require('./config.json');

const secret = process.env.NODE_ENV === 'production' ? process.env.APP_SECRET : 'dev-secret';
if (!secret) {
  throw new Error('Unable to start in production mode with no APP_SECRET set!');
}

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

function setupAuth() {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({ secret: secret, resave: false, saveUninitialized: false }));
  const auth = new Authentication(pool, passport);
  passport.use(new LocalStrategy(auth.authenticate));
  app.use(passport.initialize());
  app.use(passport.session());
}

setupAuth();


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
app.post('/api/login', passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login-failed'
}));

app.get('/api/user', function(req, res) {
  res.send({logged: req.user !== undefined, username: req.user ? req.user.username : null});
});

app.post('/api/register', function(req, res) {
  Promise.try(function() {
    return bcrypt.hashAsync(req.body.password, 2).catch(addBcryptType);
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

// restricted endpoints below

const restricted = () => ensureLogin.ensureLoggedIn(serverConfig.login);

app.post('/api/logout', restricted(), function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      res.send('Error when logging out.');
      return;
    }
    res.redirect('/');
  });
});

app.get('/profile', restricted(), function(req, res) {
  res.send('yay, logged in!');
});
app.post('/api/upload', restricted(), upload.single('image'), function(req, res) {
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
app.get('/api/upload', restricted(), function(req, res) {
  res.send(content);
});

app.listen(process.env.PORT || 8080);

pool.on('error', function (err, client) {

  console.error('idle client error', err.message, err.stack, client);
});
