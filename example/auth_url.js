'use strict'

const Picasa = require('../.')
const config = require('./config')

const clientId = config.clientId
const redirectURI = config.redirectURI
const clientSecret = config.clientSecret

// First stept
const picasa = new Picasa(clientId, redirectURI, clientSecret)

console.log(picasa.getAuthURL())
