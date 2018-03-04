'use strict'

const Picasa = require('../.')
const config = require('./config')

// Second step
const code = '4/AAArsRhVP1HOfPmnh0dOqxMB7SfPAWE8roAI9JTHaKi6Q9qtCCPdhxh0HOwejQf7aEFNYMgLfaeaN95wjMVBWI0'

const picasa = new Picasa(config)

picasa.getAccessToken(config, code, (error, accessToken) => {
  console.log(error, accessToken)
})