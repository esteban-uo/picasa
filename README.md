CI
--

[![Build Status](https://travis-ci.org/esteban-uo/picasa.svg)](https://travis-ci.org/esteban-uo/picasa)

A simple Picasa Web Albums client (2.0) for nodejs. Includes Auth helpers.

Install
-------

```
$ npm install --save ...
```

Usage
-----

```js
const Picasa = require('picasa')

const picasa = new Picasa()
```

**NOTE**: Every Picasa API request requires an access token.

### Photos
Get all photos.

```js

const options = {     
  'max-results' : 10 // by default is all photos
}

// Get 10 photos
picasa.getPhotos(accessToken, options, (error, photos) => {
  console.log(error, photos)
})
```

### Auth

To get an access token please follow this flow:

1.Get the Auth URL and redirect the user to it.

```js
// Get them here https://console.developers.google.com/home/dashboard
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
// Get them here https://console.developers.google.com/home/dashboard
const config = {
  clientId     : 'yourClientId',
  redirectURI  : 'redirectURI'
  clientSecret : 'yourClientSecret'
}

picasa.getAccessToken(config, code, (error, accessToken) => {
  console.log(error, accessToken)
})
```


### getPhotos

License
-------

MIT ©

---

Play around https://developers.google.com/oauthplayground/?code=4/usq8QmuezR3Au_0UKyj9-UXmf6Bw_ij8KFWgIziYbpM#

Picasa Docs https://developers.google.com/picasa-web/docs/2.0/developers_guide_protocol
