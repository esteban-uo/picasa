CI
--

[![Build Status](https://travis-ci.org/esteban-uo/picasa.svg)](https://travis-ci.org/esteban-uo/picasa)

A simple Picasa Web Albums client (2.0) for nodejs. Includes Auth helpers.

Install
-------

```
$ npm install --save picasa
```

Usage
-----

(Check out the examples dir too, rename config.example.json > config.json and add your credentials)

```js
const Picasa = require('picasa')

const picasa = new Picasa()
```

**NOTE**: Every Picasa API request requires an access token.

### Photos

#### Get

```js

const options = {
  maxResults : 10 // by default get all
  albumId : "6338620891611370881" // by default all photos are selected
}

picasa.getPhotos(accessToken, options, (error, photos) => {
  console.log(error, photos)
})
```

#### Post

Where binary is the binary's file and the albumId the album id to be stored.

```js
const photoData = {
  title       : 'A title',
  summary     : 'Summary or description',
  contentType : 'image/jpeg',             // image/bmp, image/gif, image/png
  binary      : binary
}

picasa.postPhoto(accessToken, albumId, photoData, (error, photo) => {
  console.log(error, photo)
})
```

#### Delete

```js
picasa.deletePhoto(accessToken, albumId, photoId, (error) => {
  console.log(error)
})
```

### Albums
#### Get
```js
const options = {}

picasa.getAlbums(accessToken, options,  (error, albums) => {
  console.log(error, albums)
})
```

#### Create
```js
const albumData = {
  title: 'My first album',
  summary: 'First album with Picasa API'
}

picasa.createAlbum(accessToken, albumData,  (error, albums) => {
  console.log(error, albums)
})
```

### Auth

To get an access token follow the next flow:

1.Get the Auth URL and redirect the user to it.

```js
// Get config here API Manager > Credentials https://console.developers.google.com/home/dashboard
const config = {
  clientId     : 'yourClientId',
  redirectURI  : 'redirectURI'
}

const authURL = picasa.getAuthURL(config)
```

2.Google displays a consent screen to the user, asking them to authorize your application to request some of their data.

3.Google redirects a code to your redirectURI.

4.Use the code given as GET param in order to get an access token:

```js
// Get config here API Manager > Credentials https://console.developers.google.com/home/dashboard
const config = {
  clientId     : 'yourClientId',
  redirectURI  : 'redirectURI'
  clientSecret : 'yourClientSecret'
}

picasa.getAccessToken(config, code, (error, accessToken, refreshToken) => {
  console.log(error, accessToken, refreshToken)
})
```

5.If you need to renew an expired `accessToken` use the `refreshToken` with `renewAccessToken`:

```js
const config = {
  clientId     : 'yourClientId',
  redirectURI  : 'redirectURI'
  clientSecret : 'yourClientSecret'
}

picasa.renewAccessToken(config, refreshToken, (error, accessToken) => {
  console.log(error, accessToken)
})
```

Change Log
-------
***16/05/2017***: Get album, Create Album, Renew access token added. Get Photos can get all photos from an album id or all.

Contributors
-------
Thanks to
[z1c0](https://github.com/z1c0), [hbakhtiyor](https://github.com/hbakhtiyor), [pauarge](https://github.com/pauarge), [wreuven](https://github.com/wreuven)

License
-------

MIT ©

---

Play around https://developers.google.com/oauthplayground/?code=4/usq8QmuezR3Au_0UKyj9-UXmf6Bw_ij8KFWgIziYbpM#

Picasa Docs https://developers.google.com/picasa-web/docs/2.0/developers_guide_protocol