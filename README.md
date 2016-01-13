# Passport-InfoGym

[Passport](http://passportjs.org/) strategy for authenticating with
[InfoGym](https://www.infogym.no/) using the OAuth 2.0 API.

This module lets you authenticate using InfoGym in your Node.js applications.
By plugging into Passport, InfoGym authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

```bash
npm install passport-infogym --save
```

## Usage

#### Configure Strategy

The InfoGym authentication strategy authenticates users using a InfoGym account
and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user, as well as `options`
specifying a client id, client secret, and callback url.

```js
const strategyOptions =
  { clientID: INFOGYM_CLIENT_ID
  , clientSecret: INFOGYM_CLIENT_SECRET
  , callbackURL: 'https://www.example.com/auth/infogym/callback'
  }
passport.use(new InfoGymStrategy(strategyOptions, verifyInfoGym))
function verifyInfoGym(accessToken, refreshToken, profile, done) {
  User.findOrCreate({ infogymId: profile.id }, function(err, user) {
    return done(err, user)
  })
}
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'infogym'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get('/auth/infogym', passport.authenticate('infogym'));

app.get('/auth/infogym/callback',
  passport.authenticate('infogym', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

## License

[The MIT License](http://opensource.org/licenses/MIT)
