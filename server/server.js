'use strict';
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

function createBlurThumbnail(image, mime) {
    return new Promise(function(resolve, reject) {
        Jimp.read(image).then(img => {
            img.blur(4);
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

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../public/'));
app.get('/api/image/newest', function(req, res) {
    db.any('SELECT images.id, images.name, images.created, users.username FROM images' +
        ' INNER JOIN users ON images.userid=users.id ORDER BY images.created DESC LIMIT 5;')
        .then(data => res.send(data))
        .catch(err => res.send({success: false, error: err}));
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

app.get('/api/image/:id/gear', function(req, res) {
    db.any('SELECT gear.name, gear.gear_type FROM public.image_gear INNER JOIN public.gear ON image_gear.gear_id=gear.id WHERE image_id = $1', [req.params.id])
    .then(data => res.send(data))
    .catch(err => res.status(500).send({sucess: false, error: err}));
});

app.get('/api/image/:id/filters', function(req, res) {
    db.any('SELECT image_filter.exposure, image_filter.subframes, gear.name FROM image_filter ' +
    'INNER JOIN gear ON image_filter.filter=gear.id WHERE image_id = $1', [req.params.id])
    .then(data => res.send(data))
    .catch(err => res.status(500).send({success: false, error: err}));
});

app.get('/api/image/:id/details', function(req, res) {
    db.any('SELECT images.created, images.description, images.name, users.username FROM images ' +
    'INNER JOIN users ON images.userid=users.id WHERE images.id = $1', [req.params.id])
    .then(data => res.send(data))
    .catch(err => res.status(500).send({sucess: false, error: err}));
});

app.get('/api/image/:id/thumbnail', function(req, res) {
    db.oneOrNone('SELECT thumbnail, mimetype FROM public.images WHERE id = $1', [req.params.id])
    .then(data => {
        const img = new Buffer(data.thumbnail, 'binary');
        res.writeHead(200, {
            'Content-Type': data.mimetype,
            'Content-Length': img.length
        });
        res.end(img);
    }).catch(err => res.status(404).json({success: false, error: err}));
});
app.get('/api/image/:id/blur', function(req, res) {
    db.oneOrNone('SELECT thumbnail, mimetype FROM public.images WHERE id = $1', [req.params.id])
    .then(data => {
        const img = new Buffer(data.thumbnail, 'binary');
        createBlurThumbnail(img, data.mimetype).then(blur => {
            res.writeHead(200, {
                'Content-Type': data.mimetype,
                'Content-Length': blur.length
            });
            res.end(blur);
        });
    }).catch(err => res.status(404).json({success: false, error: err}));
});
app.get('/api/categories', function(req, res) {
    db.any('SELECT * FROM categories')
    .then(data => res.send(data))
    .catch(err => res.status(500).send({success: false, error: err}));
});
app.get('/api/categories/images/:name', function(req, res) {
    db.one('SELECT id FROM categories WHERE name = $1', [req.params.name])
    .then(name => {
        db.any('SELECT images.id, images.name, images.created, users.username FROM images ' +
        'INNER JOIN users ON images.userid=users.id WHERE category_id = $1', [name.id])
        .then(data => res.send(data)
        ).catch(err => res.status(500).send({success: false, error: err}));
    }).catch(err => res.status(500).send({success: false, error: err}));
});

app.get('/api/image/user/:username', function(req, res) {
    db.one('SELECT COUNT(id) FROM users WHERE username = $1', [req.params.username])
        .then(data => {
            if(data.count === '1') {
                db.manyOrNone('SELECT images.id, images.name, images.created, users.username FROM users' +
                    ' INNER JOIN images ON users.id=images.userid WHERE users.username = $1 ORDER BY images.created DESC;', [req.params.username])
                .then(images => res.send(images))
                .catch(err => res.status(500).send({success: false, error: err}));
            } else {
                res.send({success: false, error: 'User not found!'});
            }
        })
        .catch(err => res.status(500).send({success: false, error: err}));
});

app.post('/api/login', passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login-failed.html'
}));

app.get('/api/user', function(req, res) {
    res.send({
        logged: req.user !== undefined,
        id: req.user ? req.user.id : null,
        username: req.user ? req.user.username : null,
        role: req.user ? req.user.role : null
    });
});

app.post('/api/register', function(req, res) {
    db.one('SELECT count(username) FROM users WHERE username = $1', [req.body.username])
    .then(result => {
        if(result.count === '0') {
            console.log(result.count);
            Promise.try(function() {
                return bcrypt.hashAsync(req.body.password, 2).catch(addBcryptType);
            }).then(function(hash) {
                db.none('INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', [req.body.username, hash, 'user'])
                .then(() => res.send({success: true, username: req.body.username}))
                .catch(err => res.status(500).send({success: false, error: err}));
            });
        } else {
            res.status(400).send({success: false, error: 'Username already exist! Choose another!'});
        }
    });
});

// restricted endpoints below

const restricted = () => ensureLogin.ensureLoggedIn(serverConfig.login);

app.post('/api/logout', restricted(), function(req, res) {
    req.session = null;
    res.redirect('/');
});

app.post('/api/upload', restricted(), upload.single('image'), function(req, res) {
    createThumbnail(req.file.buffer, req.file.mimetype, 200, 140).then(thumbnail => {
        db.one('INSERT INTO public.images (name, image, thumbnail, mimetype, created, userid, category_id, description) ' +
        'VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6, $7) RETURNING id',
        [req.body.name, req.file.buffer, thumbnail, req.file.mimetype, req.user.id, req.body.category, req.body.description])
        .then(data => res.send({success: true, id: data.id}))
        .catch(err => res.status(500).send({success: false, error: err}));
    });
});
app.post('/api/gear', restricted(), function(req, res) {
    db.none('INSERT INTO gear (userid, gear_type, name) VALUES ($1, $2, $3)', [req.user.id, req.body.gearType, req.body.gearName])
    .then(() => res.send({success: true}))
    .catch(err => res.status(500).send({success: false, error: err}));
});
app.get('/api/gear', restricted(), function(req, res) {
    db.manyOrNone('SELECT id, gear_type, name FROM gear WHERE userid = $1 ORDER BY gear_type', [req.user.id])
    .then(data => {
        res.send(data);
    })
    .catch(err => res.status(500).send({success: false, error: err}));
});

app.delete('/api/gear/:id', restricted(), function(req, res) {
    db.none('DELETE FROM gear WHERE id = $1 AND userid = $2', [req.params.id, req.user.id])
    .then(() => res.send({success: true}))
    .catch(err => res.status(500).send({sucess: false, error: err}));
});

app.post('/api/upload/filters', restricted(), function(req, res) {
    db.one('SELECT count(image_id) FROM image_filter WHERE image_id = $1', [req.body.id])
    .then(result => {
        if(result.count === '0') {
            db.one('SELECT userid FROM images WHERE id = $1', [req.body.id])
            .then(data => {
                if(data.userid === String(req.user.id)) {
                    const filterSet = new pgp.helpers.ColumnSet(['image_id', 'filter', 'subframes', 'exposure'], {table: 'image_filter'});
                    const filterQuery = pgp.helpers.insert(req.body.filterArray, filterSet);
                    db.none(filterQuery)
                    .then(() => res.send({success: true, id: req.body.id}))
                    .catch(err => res.status({success: false, error: err}));
                } else {
                    res.status(400).send({success: false, error: 'User don\' own image'});
                }
            }).catch(err => res.status({success: false, error: err}));
        } else {
            res.status(400).send({success: false, error: 'Filter data already exists'});
        }
    }).catch(err => res.status({success: false, error: err}));
});

app.post('/api/upload/details', restricted(), function(req, res) {
    db.one('SELECT count(image_id) FROM image_gear WHERE image_id = $1', [req.body.id])
    .then(result => {
        console.log(result.count);
        if(result.count === '0') {
            //no entrys
            db.one('SELECT userid FROM images WHERE id = $1', [req.body.id])
            .then(data => {
                if(data.userid === String(req.user.id)) {
                    //right user
                    const cs = new pgp.helpers.ColumnSet(['image_id', 'gear_id'], {table: 'image_gear'});
                    const query = pgp.helpers.insert(req.body.gearArray, cs);
                    db.none(query)
                    .then(() => res.send({success: true, id: req.body.id}))
                    .catch(err => res.status({success: false, error: err}));
                } else {
                    res.status(400).send({success: false, error: 'User don\' own image'});
                }
            }).catch(err => res.status(500).send({success: false, error: err}));
        } else {
            res.status(400).send({success: false, error: 'Gear data already exists'});
        }
    }).catch(err => res.status(500).send({success: false, error: err}));
});

app.get('/api/user/image/:id', restricted(), function(req, res) {
    db.one('SELECT count(id) FROM images WHERE userid = $1 AND id = $2', [req.user.id, req.params.id])
    .then(result => {
        if(result.count === '1') {
            res.send({success: true});
        } else {
            res.status(400).send({success: false, error: 'User don\'t own image'});
        }
    }).catch(err => res.status(500).send({success: false, error: err}));
});

// admin endpoints below
const adminOnly = (req, res, next) => {
    if(req.user && req.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).send({sucess: false, error: 'Insufficient privileges'});
    }
};

app.post('/api/category', restricted(), adminOnly, function(req, res) {
    db.none('INSERT INTO categories (name, image) VALUES ($1, $2)', [req.body.name, req.body.image])
    .then(() => res.send({sucess: true}))
    .catch(err => res.status(500).send({success: false, error: err}));
});

app.post('/api/category/change/image', restricted(), adminOnly, function(req, res) {
    db.oneOrNone('SELECT count(id) FROM categories WHERE name = $1', [req.body.id])
    .then(result => {
        if(result.count === '1') {
            db.none('UPDATE categories SET image = $1 WHERE name = $2', [req.body.image, req.body.id])
            .then(() => res.send({success: true}))
            .catch(err => res.status(500).send({success: false, error: err}));
        } else {
            res.status(400).send({sucess: false, error: 'Category doesn\'t exist' });
        }
    })
    .catch(err => res.status(500).send({success: false, error: err}));
});

app.delete('/api/category/:id', restricted(), adminOnly, function(req, res) {
    db.none('DELETE FROM categories WHERE id = $1', [req.params.id])
    .then(() => res.send({success: true}))
    .catch(e => res.status(500).send({success: false, error: e}));
});

app.get('/api/users', restricted(), adminOnly, function(req, res) {
    db.any('SELECT id, username, role FROM users ORDER BY id DESC')
    .then(data => res.send(data))
    .catch(err => res.status(500).send({sucess: false, error: err}));
});

app.post('/api/users/promote/', restricted(), adminOnly, function(req, res) {
    if(req.user.id === req.body.id) {
        res.status(400).send({sucess: false, error: 'unable to demote self'});
    } else {
        db.none('UPDATE users SET role = $1 WHERE id = $2', [req.body.group, req.body.id])
        .then(() => res.send({sucess: true}))
        .catch(err => res.status(500).send({success: false, error: err}));
    }
});

app.delete('/api/users/:id', restricted(), adminOnly, function(req, res) {
    if(req.user.id === req.params.id) {
        res.status(400).send({sucess: false, error: 'Unable to delete self'});
    } else {
        db.none('DELETE FROM users WHERE id = $1', [req.params.id])
        .then(() => res.send({success: true}))
        .catch(err => res.status(500).send({success: false, error: err}));
    }
});

app.get('/api/*', function(req, res) {
    res.status(404).send({message: 'API endpoint not found'});
});

app.get('*', function(req, res) {
    res.sendFile('./public/index.html', {root: __dirname + '/../'});
});

app.listen(process.env.PORT || 8080);
