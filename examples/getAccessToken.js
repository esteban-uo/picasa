'use strict'

const Picasa = require('../.')
const config = require('./config')

// Second step
const code = '4/etTOs_1FbU0vFqKFoX5IV9xe7z0Q5IBZICy0m1iGMNI'

const picasa = new Picasa(config)

picasa.getAccessToken(config, code, (error, accessToken) => {
  console.log(error, accessToken)
})
