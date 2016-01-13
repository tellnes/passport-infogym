'use strict'

const inherits = require('inherits')
const OAuth2Strategy = require('passport-oauth2')
const InternalOAuthError = require('passport-oauth2').InternalOAuthError

module.exports = InfoGymStrategy

inherits(InfoGymStrategy, OAuth2Strategy)
function InfoGymStrategy(options, verify) {
  if (!options)
    throw new TypeError('InfoGymStrategy requires an options argument.')

  options.authorizationURL =
    options.authorizationURL || 'https://auth.infogym.no/authorize'

  options.tokenURL =
    options.tokenURL || 'https://auth.infogym.no/token'

  options.scopeSeparator =
    options.scopeSeparator || ' '

  options.customHeaders =
    options.customHeaders || {}

  if (!options.customHeaders['User-Agent'])
    options.customHeaders['User-Agent'] =
      options.userAgent || 'passport-infogym'

  OAuth2Strategy.call(this, options, verify)

  this.name = 'infogym'
  this._userProfileURL = options.userProfileURL || 'https://api.infogym.no/user'
  this._oauth2.useAuthorizationHeaderforGET(true)
}

InfoGymStrategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(this._userProfileURL, accessToken, function(err, body) {
    if (err)
      return done(new InternalOAuthError('Failed to fetch user profile', err))

    let json
    try {
      json = JSON.parse(body)
    } catch(ex) {
      return done(new Error('Failed to parse user profile'))
    }

    const profile =
      { 'id': json.id
      , 'displayName': json.name
      , 'updated': json.modified
      , 'birthday': json.birthday
      , 'preferredUsername': json.login
      }

    if (json.email) {
      profile.emails = [ json.email ]
    }

    if (json.photo) {
      profile.photos = [ json.photo ]
    }

    profile.provider = 'infogym'
    profile._raw = body
    profile._json = json

    done(null, profile)
  })
}
