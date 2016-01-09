'use strict'

const Picasa = require('../.')
const config = require('./config')

const clientId = config.clientId
const redirectURI = config.redirectURI
const clientSecret = config.clientSecret

// Third step
const accessToken = 'ya29.ZAIIS7BTRl14tAPaL-q0m3WO57GqLKftcFxIlVSDHtpa-bGrodUw-acXcD4gVZ3Icf0A5d0'

const picasa = new Picasa(clientId, redirectURI, clientSecret)

picasa.getPhotos(accessToken, null, (error, photos) => {
  console.log(error, photos)
})
