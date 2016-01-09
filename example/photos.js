'use strict'

const Picasa = require('../.')
const config = require('./config')

// Third step
const accessToken = 'ya29.ZAIIS7BTRl14tAPaL-q0m3WO57GqLKftcFxIlVSDHtpa-bGrodUw-acXcD4gVZ3Icf0A5d0'

const picasa = new Picasa(config)

picasa.getPhotos(accessToken, null, (error, photos) => {
  console.log(error, photos)
})
