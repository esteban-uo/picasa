'use strict'

let request = require('request')

function picasaRequest (method, requestOptions, callback) {
  request[method](requestOptions, (error, response, body) => {
    if (error) return callback(error)

    if (response.statusCode == 403) return callback(new Error(body))
    if (response.statusCode != 200) {
      const unknownError = new Error('UNKNOWN_ERROR')

      unknownError.statusCode = response.statusCode
      unknownError.body = body

      return callback(unknownError)
    }

    callback(null, body)
  })
}

module.exports = picasaRequest
