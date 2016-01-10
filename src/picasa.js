'use strict'

const querystring = require('querystring')

const executeRequest = require('./request')

const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/auth'
const GOOGLE_API_HOST = 'https://www.googleapis.com'
const GOOGLE_API_PATH = '/oauth2/v3/token'

const PICASA_HOST = 'https://picasaweb.google.com'
const PICASA_SCOPE = '/data'
const PICASA_API_PATH = '/feed/api/user/default'

function Picasa () {
  this.executeRequest = executeRequest
}

Picasa.prototype.getPhotos = getPhotos

Picasa.prototype.getAuthURL = getAuthURL
Picasa.prototype.getAccessToken = getAccessToken

function getPhotos (accessToken, options, callback) {
  const requestOptions = buildPicasaRequestOptions(accessToken, 'photo', options)

  this.executeRequest('get', requestOptions, (error, body) => {
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

function getAuthURL (config) {
  const authenticationParams = {
    access_type   : 'offline',
    scope         : `${PICASA_HOST}${PICASA_SCOPE}`,
    response_type : 'code',
    client_id     : config.clientId,
    redirect_uri  : config.redirectURI
  }

  const authenticationQuery = querystring.stringify(authenticationParams)

  return `${GOOGLE_AUTH_ENDPOINT}?${authenticationQuery}`
}

function getAccessToken (config, code, callback) {
  const accessTokenParams = {
    grant_type    : 'authorization_code',
    code          : code,
    redirect_uri  : config.redirectURI,
    client_id     : config.clientId,
    client_secret : config.clientSecret
  }

  const accessTokenQuery = querystring.stringify(accessTokenParams)
  const options = {
    url : `${GOOGLE_API_HOST}${GOOGLE_API_PATH}?${accessTokenQuery}`
  }

  this.executeRequest('post', options, (error, body) => {
    if (error) return callback(error)

    callback(null, body.access_token)
  })
}

function buildPicasaRequestOptions (accessToken, kind, options) {
  const fetchKind = 'json'

  const accessTokenParams = {
    alt          : fetchKind,
    kind         : kind,
    access_token : accessToken
  }

  options = options || {}

  if (options.maxResults) accessTokenParams['max-results'] = options.maxResults

  const accessTokenQuery = querystring.stringify(accessTokenParams)

  return {
    url : `${PICASA_HOST}${PICASA_SCOPE}${PICASA_API_PATH}?${accessTokenQuery}`,
    headers: {
      'GData-Version': '2'
    }
  }
}

function checkParam (param) {
  if (param === undefined) return ''
  else if (isValidType(param)) return param
  else if (isValidType(param['$t'])) return param['$t']
  else return param
}

function isValidType (value) {
  return typeof value === 'string' || typeof value === 'number'
}

module.exports = Picasa
