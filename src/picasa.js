'use strict'

const querystring = require('querystring')

const request = require('./request')

const userAuthenticationEndpoint = 'https://accounts.google.com/o/oauth2/auth'
const googleScope = 'https://picasaweb.google.com/data/'
const googleAPIhost = 'https://www.googleapis.com'
const googleAPIPath = '/oauth2/v3/token'

function Picasa (config) {
  this.clientId = config.clientId
  this.redirectURI = config.redirectURI
  this.clientSecret = config.clientSecret

  this.executeRequest = request.executeRequest
  this.picasaRequest = request.picasaRequest
}

Picasa.prototype.getPhotos = getPhotos

Picasa.prototype.getAuthURL = getAuthURL
Picasa.prototype.getAccessToken = getAccessToken

function getPhotos (accessToken, options, callback) {
  this.picasaRequest(accessToken, 'get', 'photo', options, (error, body) => {
    if (error) return callback(error)

    const photoSchema = {
      'gphoto$id'                : 'id',
      'gphoto$albumid'           : 'album_id',
      'gphoto$access'            : 'access',
      'gphoto$width'             : 'width',
      'gphoto$height'            : 'height',
      'gphoto$size'              : 'size' ,
      'gphoto$checksum'          : 'checksum',
      'gphoto$timestamp'         : 'timestamp',
      'gphoto$imageVersion'      : 'image_version',
      'gphoto$commentingEnabled' : 'commenting_enabled',
      'gphoto$commentCount'      : 'comment_count',
      'content'                  : 'content',
      'title'                    : 'title',
      'summary'                  : 'summary'
    }

    const photos = body.feed.entry.map(entry => {
      let photo = {}

      Object.keys(photoSchema).forEach(schemaKey => {
        const key = photoSchema[schemaKey]

        if (key) photo[key] = checkParam(entry[schemaKey])
      })

      return photo
    })

    callback(null, photos)
  })
}

function checkParam (param) {
  if (!param) return ''
  if (isValidType(param)) return param
  else if (isValidType(param['$t'])) return param['$t']
  else return param
}

function isValidType (value) {
  return typeof value === 'string' || typeof value === 'number'
}

function getAuthURL () {
  const authenticationParams = {
    access_type   : 'offline',
    scope         : googleScope,
    response_type : 'code',
    client_id     : this.clientId,
    redirect_uri  : this.redirectURI
  }

  const authenticationQuery = querystring.stringify(authenticationParams)

  return `${userAuthenticationEndpoint}?${authenticationQuery}`
}

function getAccessToken (code, callback) {
  const accessTokenParams = {
    grant_type    : 'authorization_code',
    code          : code,
    redirect_uri  : this.redirectURI,
    client_id     : this.clientId,
    client_secret : this.clientSecret
  }

  const accessTokenQuery = querystring.stringify(accessTokenParams)
  const options = {
    url : `${googleAPIhost}${googleAPIPath}?${accessTokenQuery}`
  }

  this.executeRequest('post', options, (error, body) => {
    if (error) return callback(error)

    callback(null, body.access_token)
  })
}

module.exports = Picasa
