'use strict'

const fs = require('fs')

const Picasa = require('../.')

const accessToken = 'ya29.ZQLb0DRxf7PzBvkok6DGoSime3lym2ZNCzFPhyU1HGzkzwXaSwffivulMXcGFcgM4x2w'
const albumId = '6236607441185654065'

const picasa = new Picasa()

fs.readFile(__dirname + '/photos/jake.jpg', (err, binary) => {
  const photoData = {
    title       : 'Jake the dog',
    summary     : 'Corgis ftw!',
    contentType : 'image/jpeg',
    binary      : binary
  }

  picasa.postPhoto(accessToken, albumId, photoData, (error, response) => {
    console.log(error, response)
  })
})
