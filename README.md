CI
--

[![Build Status](https://travis-ci.org/esteban-uo/picasa.svg)](https://travis-ci.org/esteban-uo/picasa)

A simple Picasa Web Albums client (2.0) for nodejs. Includes OAuth helpers.

Install
-------

```
$ npm install --save ...
```

Usage
-----

```js
const Picasa = require('picasa')

// Configure them here https://console.developers.google.com/home/dashboard
const options = {
  clientId     : 'yourClientId',
  redirectURI  : 'redirectURI',
  clientSecret : 'yourClientSecret'
}

const picasa = new Picasa(options)
```

API
---

### Auth

#### auth_url

#### access_token

### getPhotos

License
-------

MIT ©

---

Play around https://developers.google.com/oauthplayground/?code=4/usq8QmuezR3Au_0UKyj9-UXmf6Bw_ij8KFWgIziYbpM#

Picasa Docs https://developers.google.com/picasa-web/docs/2.0/developers_guide_protocol

Inspiration http://www.rubydoc.info/github/morgoth/picasa/Picasa/API/Album
