'use strict'

const querystring = require('querystring')
let request = require('request')

function picasaRequest (accessToken, method, kind, options, callback) {
  const host = 'https://picasaweb.google.com'
  const path = '/data/feed/api/user/default'
  const fetchKind = 'json'

  const accessTokenParams = {
    alt          : fetchKind,
    kind         : kind,
    access_token : accessToken
  }

  options = options || {}

  if (options.maxResults) accessTokenParams['max-results'] = options.maxResults

  const accessTokenQuery = querystring.stringify(accessTokenParams)
  const requestOptions = {
    url : `${host}${path}?${accessTokenQuery}`,
    headers: {
      'GData-Version': '2'
    }
  }

  executeRequest(method, requestOptions, callback)
}

function executeRequest (method, requestOptions, callback) {
  request[method](requestOptions, (error, response, body) => {
    if (error) return callback(error)

    if (response.statusCode == 403) return callback(new Error(body))
    if (response.statusCode != 200) {
      const unknownError = new Error('UNKNOWN_ERROR')

      unknownError.statusCode = response.statusCode
      unknownError.body = body

      return callback(unknownError)
    }

    try {
      callback(null, JSON.parse(body))
    } catch (error) {
      callback(error)
    }
  })
}

module.exports = {
  picasaRequest  : picasaRequest,
  executeRequest : executeRequest
}
