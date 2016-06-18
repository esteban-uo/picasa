'use strict'

const Picasa = require('../.')

const accessToken = 'ya29.CjUFA394FN067ONSTiJ23prmQvS8TGmBL_H16NP-dMec2Iv5je5OAJ5rohbI2QecK0aZKyzZMg'

const picasa = new Picasa()

picasa.getAlbums(accessToken, null, (error, albums) => {
  console.log(error, albums)
})
