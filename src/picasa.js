'use strict'

const querystring = require('querystring')

const executeRequest = require('./executeRequest')

const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/auth'
const GOOGLE_API_HOST = 'https://www.googleapis.com'
const GOOGLE_API_PATH = '/oauth2/v3/token'
const GOOGLE_API_PATH_NEW = '/oauth2/v4/token'

const PICASA_SCOPE = 'https://picasaweb.google.com/data'
const PICASA_API_FEED_PATH = '/feed/api/user/default'
const PICASA_API_ENTRY_PATH = '/entry/api/user/default'

const FETCH_AS_JSON = 'json'

function Picasa () {
  this.executeRequest = executeRequest
}

Picasa.prototype.getPhotos = getPhotos
Picasa.prototype.postPhoto = postPhoto
Picasa.prototype.deletePhoto = deletePhoto
Picasa.prototype.getAlbums = getAlbums
Picasa.prototype.createAlbum = createAlbum

// Auth utilities
Picasa.prototype.getAuthURL = getAuthURL
Picasa.prototype.getAccessToken = getAccessToken
Picasa.prototype.renewAccessToken = renewAccessToken

function getAlbums (accessToken, options, callback) {
  const accessTokenParams = {
    alt          : FETCH_AS_JSON,
    access_token : accessToken
  }

  options = options || {}

  const requestQuery = querystring.stringify(accessTokenParams)

  const requestOptions = {
    url : `${PICASA_SCOPE}${PICASA_API_FEED_PATH}?${requestQuery}`,
    headers: {
      'GData-Version': '2'
    }
  }

  this.executeRequest('get', requestOptions, (error, body) => {
    if (error) return callback(error)

    const albums = body.feed.entry.map(
      entry => parseEntry(entry, albumSchema)
    )

    callback(null, albums)
  })
}

function deletePhoto (accessToken, albumId, photoId, callback) {
  const requestQuery = querystring.stringify({
    alt          : FETCH_AS_JSON,
    access_token : accessToken
  })

  const requestOptions = {
    url : `${PICASA_SCOPE}${PICASA_API_ENTRY_PATH}/albumid/${albumId}/photoid/${photoId}?${requestQuery}`,
    headers: {
      'If-Match': '*'
    }
  }

  this.executeRequest('del', requestOptions, callback)
}

function createAlbum (accessToken, albumData, callback) {
  const requestQuery = querystring.stringify({
    alt          : FETCH_AS_JSON,
    access_token : accessToken
  })

  const albumInfoAtom = `<entry xmlns='http://www.w3.org/2005/Atom'
                            xmlns:media='http://search.yahoo.com/mrss/'
                            xmlns:gphoto='http://schemas.google.com/photos/2007'>
                          <title type='text'>${albumData.title}</title>
                          <summary type='text'>${albumData.summary}</summary>
                          <gphoto:access>private</gphoto:access>
                          <category scheme='http://schemas.google.com/g/2005#kind'
                            term='http://schemas.google.com/photos/2007#album'></category>
                         </entry>`

  const requestOptions = {
    url       : `${PICASA_SCOPE}${PICASA_API_FEED_PATH}?${requestQuery}`,
    body      : albumInfoAtom,
    headers   : {'Content-Type': 'application/atom+xml'}
  }

  this.executeRequest('post', requestOptions, (error, body) => {
    if (error) return callback(error)

    const album = parseEntry(body.entry, albumSchema)

    callback(error, album)
  })
}

function postPhoto (accessToken, albumId, photoData, callback) {
  const requestQuery = querystring.stringify({
    alt          : FETCH_AS_JSON,
    access_token : accessToken
  })

  const photoInfoAtom = `<entry xmlns="http://www.w3.org/2005/Atom">
                          <title>${photoData.title}</title>
                          <summary>${photoData.summary}</summary>
                          <category scheme="http://schemas.google.com/g/2005#kind" term="http://schemas.google.com/photos/2007#photo"/>
                        </entry>`

  const requestOptions = {
    url       : `${PICASA_SCOPE}${PICASA_API_FEED_PATH}/albumid/${albumId}?${requestQuery}`,
    multipart : [
      {'Content-Type' : 'application/atom+xml', body : photoInfoAtom},
      {'Content-Type' : photoData.contentType, body : photoData.binary}
    ]
  }

  this.executeRequest('post', requestOptions, (error, body) => {
    if (error) return callback(error)

    const photo = parseEntry(body.entry, photoSchema)

    callback(error, photo)
  })
}

function getPhotos (accessToken, options, callback) {
  const accessTokenParams = {
    alt          : FETCH_AS_JSON,
    kind         : 'photo',
    access_token : accessToken
  }

  options = options || {}

  if (options.maxResults) accessTokenParams['max-results'] = options.maxResults
  if (options.startIndex) accessTokenParams['start-index'] = options.startIndex

  const albumPart = options.albumId ? `/albumid/${options.albumId}` : ''

  const requestQuery = querystring.stringify(accessTokenParams)

  const requestOptions = {
    url : `${PICASA_SCOPE}${PICASA_API_FEED_PATH}${albumPart}?${requestQuery}`,
    headers: {
      'GData-Version': '2'
    }
  }

  this.executeRequest('get', requestOptions, (error, body) => {
    if (error) return callback(error)

    const photos = body.feed.entry.map(
      entry => parseEntry(entry, photoSchema)
    )

    callback(null, photos)
  })
}

const albumSchema = {
  'media$group.media$thumbnail' : 'thumbnail',
  'gphoto$id'                : 'id',
  'gphoto$name'              : 'name',
  'gphoto$numphotos'         : 'num_photos',
  'published'                : 'published',
  'title'                    : 'title',
  'summary'                  : 'summary',
  'gphoto$location'          : 'location',
  'gphoto$nickname'          : 'nickname',
  'rights'                   : 'rights',
  'gphoto$access'            : 'access'
}

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

function parseEntry (entry, schema) {
  let photo = {}

  Object.keys(schema).forEach(schemaKey => {
    const key = schema[schemaKey]

    if (key) {
      const value = extractValue(entry, schemaKey, key);
      photo[key] = value;
    }
  })

  return photo
}

function extractValue(entry, schemaKey){
  if(schemaKey.indexOf('.') !== -1){
    const tempKey = schemaKey.split('.')[0];
    return extractValue(checkParam(entry[tempKey]), schemaKey.replace(`${tempKey}.`, ''));
  }
  return checkParam(entry[schemaKey]);
}

function getAuthURL (config) {
  const authenticationParams = {
    access_type   : 'offline',
    scope         : `${PICASA_SCOPE}`,
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

  const requestQuery = querystring.stringify(accessTokenParams)
  const options = {
    url : `${GOOGLE_API_HOST}${GOOGLE_API_PATH}?${requestQuery}`
  }

  this.executeRequest('post', options, (error, body) => {
    if (error) return callback(error)

    callback(null, body.access_token, body.refresh_token)
  })
}

function renewAccessToken (config, refresh_token, callback){
  const refreshTokenParams = {
    grant_type: 'refresh_token',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: refresh_token
  }

  const requestQuery = querystring.stringify(refreshTokenParams)
  const options = {
    url: `${GOOGLE_API_HOST}${GOOGLE_API_PATH_NEW}?${requestQuery}`
  }

  this.executeRequest('post', options, (error, body) => {
    if (error) return callback(error)

      callback(null, body.access_token)
  })
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
