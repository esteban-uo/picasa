'use strict'

const Picasa = require('../.')
const config = require('./config')

// First stept
const picasa = new Picasa(config)

console.log(picasa.getAuthURL())
