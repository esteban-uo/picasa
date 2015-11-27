'use strict'

const querystring = require('querystring')
const request = require('request')
const parseString = require('xml2js').parseString

function Picasa(clientId, redirectURI, clientSecret) {
  this.clientId = clientId
  this.redirectURI = redirectURI
  this.clientSecret = clientSecret
  this.request = request
}

Picasa.prototype.getPhotos = getPhotos

Picasa.prototype.getAuthURL = getAuthURL
Picasa.prototype.getAccessToken = getAccessToken

function getPhotos (accessToken, callback) {
  const host = 'https://picasaweb.google.com'
  const path = '/data/feed/api/user/default'

  const accessTokenParams = {
    'max-results' : 1,
    alt           : 'json'
  }

  accessTokenParams.kind = 'photo'

  accessTokenParams.access_token = accessToken

  const accessTokenQuery = querystring.stringify(accessTokenParams)
  const options = {
    url : `${host}${path}?${accessTokenQuery}`,
    headers: {
      'GData-Version': '2'
    }
  }

  this.request.get(options, (error, response, body) => {
    if(error) callback(error)

    if (response.statusCode == 403) {
      return callback(new Error(body))
    }

    if (response.statusCode != 200) {
      const unknownError = new Error('UNKNOWN_ERROR')

      unknownError.statusCode = statusCode
      unknownError.body = body

      return callback(unknownError)
    }

    try {
      const parsedBody = JSON.parse(body)

      const photos = parsedBody.feed.entry.map(entry => { return entry.content })

      callback(null, photos)
    } catch (error) {
      callback(error)
    }
  })
}

function getAuthURL () {
  const userAuthenticationEndpoint = 'https://accounts.google.com/o/oauth2/auth'

  const authenticationParams = {
    access_type   : 'offline',
    scope         : 'https://picasaweb.google.com/data/',
    response_type : 'code',
    client_id     : this.clientId,
    redirect_uri  : this.redirectURI
  }

  const authenticationQuery = querystring.stringify(authenticationParams)

  return `${userAuthenticationEndpoint}?${authenticationQuery}`
}

function getAccessToken (code, callback) {
  const host = 'https://www.googleapis.com'
  const path = '/oauth2/v3/token'

  const accessTokenParams = {
    grant_type    : 'authorization_code',
    code          : code,
    redirect_uri  : this.redirectURI,
    client_id     : this.clientId,
    client_secret : this.clientSecret,
    grant_type    : 'authorization_code'
  }

  const accessTokenQuery = querystring.stringify(accessTokenParams)

  this.request.post(`${host}${path}?${accessTokenQuery}`, (error, response, body) => {
    // response.statusCode == 200   // TODO handle error

    callback(null, body.access_token)
  })
}

module.exports = Picasa
