'use strict'

const Picasa = require('../.')

// Third step
const accessToken = 'ya29.ZAIXMKYXkuw_g_1BBSWfesb5YDi5JVA343G_0oH1qtjC5A6FUdsNBR6l8VOeGyUwH9QmbIc'

const picasa = new Picasa()

picasa.getPhotos(accessToken, null, (error, photos) => {
  console.log(error, photos)
})
