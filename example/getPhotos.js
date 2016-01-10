'use strict'

const Picasa = require('../.')

const accessToken = 'ya29.ZQK3z803DuaNHbAJs6_6ujY9qNbS4yfbBEjnUpQjuvOftW45Kw7fh6SPSsK5KXH3W7Y8'

const picasa = new Picasa()

picasa.getPhotos(accessToken, null, (error, photos) => {
  console.log(error, photos)
})
