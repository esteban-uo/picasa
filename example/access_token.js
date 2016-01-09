'use strict'

const Picasa = require('../.')
const config = require('./config')

// Second step
const code = '4/D7lZJ3L24ugIbgga_82j3JUyKdMVpXppkH3-XeMAE90'

const picasa = new Picasa(config)

picasa.getAccessToken(code, (error, accessToken) => {
  console.log(error, accessToken)
})
