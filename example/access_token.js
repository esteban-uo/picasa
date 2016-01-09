'use strict'

const Picasa = require('../.')
const config = require('./config')

const clientId = config.clientId
const redirectURI = config.redirectURI
const clientSecret = config.clientSecret

// Second step
const code = '4/jYpY6FrpGm3yCBIuaA1tz1rQaY1vi-7vqQitxB1kx3U'

const picasa = new Picasa(clientId, redirectURI, clientSecret)

picasa.getAccessToken(code, (error, accessToken) => {
  console.log(error, accessToken)
})
