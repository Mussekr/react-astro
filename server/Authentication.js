'use strict';
const bcrypt = require('bcrypt');

const invalidAuthMessage = 'Incorrect username or password.';


function Authentication(db, passport) {
  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser((id, cb) => {
    db.connect(function(err, client, dbDone) {
      if (err) {
        return cb(err);
      }

      return client.query('SELECT * FROM public.users WHERE id = $1', [id], function(err, result) {
        dbDone();
        if (err) {
          return cb(err);
        }

        if (result.rows.length > 0) {
          return cb(null, result.rows[0]);
        } else {
          return cb(err);
        }
      });
    });
  });

  this.authenticate = function(username, password, authDone) {
    console.log('auth');
    db.connect(function(err, client, dbDone) {
      if (err) {
        return authDone(err);
      }

      return client.query('SELECT * FROM public.users WHERE username = $1', [username], function(err, result) {
        dbDone();
        if (err) {
          return authDone(err);
        }

        console.log('found', result.rows);

        if (result.rows.length > 0) {
          return bcrypt.compare(password, result.rows[0].password, function(err, res) {
            if (err) {
              return authDone(err);
            }

            if (res === true) {
              return authDone(null, result.rows[0]);
            } else {
              return authDone(null, false, { message: invalidAuthMessage });
            }
          });
        } else {
          return authDone(null, false, { message: invalidAuthMessage});
        }
      });
    });
  };

}

module.exports = Authentication;
