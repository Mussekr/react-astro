const express = require('express');
const app = express();
const pgp = require('pg-promise')();
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
const cookieSession = require('cookie-session');
const serverConfig = require('./config.json');

const env = process.env.NODE_ENV || 'development';
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

const forceSsl = function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    return next();
};

if (env === 'production') {
    app.use(forceSsl);
}

const configPgp = {
    poolSize: 20, // max number of clients in the pool
    host: process.env.PGHOST || 'localhost'
};
const db = pgp(configPgp);

function setupAuth() {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieSession({
        secret: secret,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        secureProxy: env === 'production'
    }));
    const auth = new Authentication(db, passport);
    passport.use(new LocalStrategy(auth.authenticate));
    app.use(passport.initialize());
    app.use(passport.session());
}

setupAuth();


app.use(express.static(__dirname + '/../public/'));
app.get('/api/image/newest', function(req, res) {
    db.any('SELECT images.id, images.name, images.created, users.username FROM images' +
        ' INNER JOIN users ON images.userid=users.id ORDER BY images.created DESC LIMIT 5;')
        .then(data => res.send(data))
        .catch(err => res.send({success: false, error: err}));
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
    db.oneOrNone('SELECT image, mimetype FROM public.images WHERE id = $1', [req.params.id])
    .then(data => {
        const img = new Buffer(data.image, 'binary');
        res.writeHead(200, {
            'Content-Type': data.mimetype,
            'Content-Length': img.length
        });
        res.end(img);
    }).catch(err => res.status(404).json({success: false, error: err}));
});

/* REWRITE AFTER IMAGE PAGE READY (gear etc)
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
});*/
app.get('/api/image/:id/thumbnail', function(req, res) {
    db.oneOrNone('SELECT thumbnail, mimetype FROM public.images WHERE id = $1', [req.params.id])
    .then(data => {
        console.log(data);
        const img = new Buffer(data.thumbnail, 'binary');
        res.writeHead(200, {
            'Content-Type': data.mimetype,
            'Content-Length': img.length
        });
        res.end(img);
    }).catch(err => res.status(404).json({success: false, error: err}));
});
app.get('/api/categories', function(req, res) {
    db.any('SELECT * FROM categories')
    .then(data => res.send(data))
    .catch(err => res.status(500).send({success: false, error: err}));
});
app.get('/api/categories/images/:id', function(req, res) {
    db.any('SELECT images.id, images.name, images.created, users.username FROM image_detail INNER JOIN images ON image_detail.image_id=images.id ' +
    'INNER JOIN users ON images.userid=users.id WHERE category_id = $1', [req.params.id])
    .then(data => res.send(data)
    ).catch(err => res.status(500).send({success: false, error: err}));
});
app.post('/api/login', passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login-failed.html'
}));

app.get('/api/user', function(req, res) {
    res.send({logged: req.user !== undefined, username: req.user ? req.user.username : null});
});

app.post('/api/register', function(req, res) {
    Promise.try(function() {
        return bcrypt.hashAsync(req.body.password, 2).catch(addBcryptType);
    }).then(function(hash) {
        db.none('INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', [req.body.username, hash, 'user'])
        .then(() => res.send({success: true}))
        .catch(err => res.status(500).send({success: false, error: err}));
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
    createThumbnail(req.file.buffer, req.file.mimetype, 200, 200).then(thumbnail => {
        db.one('INSERT INTO public.images (name, image, thumbnail, mimetype, created, userid) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5) RETURNING id',
        [req.body.name, req.file.buffer, thumbnail, req.file.mimetype, req.user.id])
        .then(data => res.send({success: true, id: data.id}))
        .catch(err => res.status(500).send({success: false, error: err}));
    });
});

//placeholder form
const content = '<html><body><form method="post" enctype="multipart/form-data" action="/api/upload"> ' +
  '<p><input type="text" name="name" placeholder="Name" /></p><p><input type="file" name="image" /></p>' +
  '<p><input type="submit" /></body></html>';
app.get('/api/upload', restricted(), function(req, res) {
    res.send(content);
});

app.get('/api/*', function(req, res) {
    console.log('API 404');
    res.status(404).send({message: 'API endpoint not found'});
});

app.get('*', function(req, res) {
    res.sendFile('./public/index.html', {root: __dirname + '/../'});
});

app.listen(process.env.PORT || 8080);
