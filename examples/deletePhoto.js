'use strict'

const Picasa = require('../.')

const accessToken = 'ya29.ZgL4X-JCVrBFQ45fQ_hVbyzbrwQMnbhXhBOJfBIA3g5olGSYS7E7-ogR2dAZ6sWGtY9FBw'
const albumId = '6236607441185654065'
const photoId = '6238488624182954434'

const picasa = new Picasa()

picasa.deletePhoto(accessToken, albumId, photoId, (error) => {
  if (error) console.log(error)
  else console.log(`Deleted photoId ${photoId} succesfully.`)
})
