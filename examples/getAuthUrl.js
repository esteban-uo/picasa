'use strict'

const Picasa = require('../.')
const config = require('./config')

// First stept
const picasa = new Picasa()

console.log(picasa.getAuthURL(config))
