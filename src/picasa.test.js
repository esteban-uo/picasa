'use strict'

const chai   = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const expect = chai.expect
chai.use(sinonChai)

const Picasa = require('./picasa')

describe('Picasa', () => {
  let picasa, stub

  const config = {
    clientId     : 'apps.google.com',
    redirectURI  : 'http://localhost',
    clientSecret : 'client_secretABC'
  }

  beforeEach(() => picasa = new Picasa())

  describe('getAlbums', () => {
    const fakeSuccessBody = {
      "feed":{
        "entry":[
          {
            "published":{  
               "$t":"2017-03-24T10:33:16.000Z"
            },
            "title":{  
               "$t":"A test album"
            },
            "summary":{  
               "$t":"Not much"
            },
            "rights":{  
               "$t":"protected"
            },
            "gphoto$id":{  
               "$t":"6401011366244305685"
            },
            "gphoto$name":{  
               "$t":"6401011366244308786"
            },
            "gphoto$location":{  
               "$t":"Utrecht"
            },
            "gphoto$access":{  
               "$t":"protected"
            },
            "gphoto$numphotos":{  
               "$t":420
            },
            "gphoto$nickname":{  
               "$t":"BobDeBouwer"
            },
            "media$group":{
              "media$thumbnail":[  
                 {  
                    "url":"https://lh3.googleusercontent.com/-kyCVqkqZt3A/WA61zE/AAAAAAE0/d3cg_CP_Te41PxQJQ1ASGp4r2hGzH_TrgCHMYCg/s160-c/6401011308785",
                    "height":160,
                    "width":160
                 }
              ]
           }
         }
        ]
      }
    }

    let albums

    beforeEach((done) => {
      stub = sinon.stub(picasa, 'executeRequest')
      stub.callsArgWithAsync(2, null, fakeSuccessBody)

      const accessToken = 'ya29.OwJqqa1Y2tivkkCWWvA8vt5ltKsdf9cDQ5IRNrTbIt-mcfr5xNj4dQu41K6hZa7lX9O-gw'

      picasa.getAlbums(accessToken, null, (error, albumsResponse) => {
        expect(error).to.be.equals(null)
        albums = albumsResponse

        done()
      })
    })

    afterEach(() => stub.restore())

    it('returns an array of albums', () => {
      expect(albums).to.be.an('Array')
    })

    it('returns albums with its props', () => {
      expect(albums.length).to.be.equals(1)
      expect(albums[0].title).to.be.equals('A test album')
      expect(albums[0].nickname).to.be.equals('BobDeBouwer')
      expect(albums[0].id).to.be.equals('6401011366244305685')
      expect(albums[0].name).to.be.equals('6401011366244308786')
      expect(albums[0].num_photos).to.be.equals(420)
      expect(albums[0].published).to.be.equals('2017-03-24T10:33:16.000Z')
      expect(albums[0].summary).to.be.equals('Not much')
      expect(albums[0].location).to.be.equals('Utrecht')
      expect(albums[0].rights).to.be.equals('protected')
      expect(albums[0].access).to.be.equals('protected')
      expect(albums[0].thumbnail[0].url).to.be.equals('https://lh3.googleusercontent.com/-kyCVqkqZt3A/WA61zE/AAAAAAE0/d3cg_CP_Te41PxQJQ1ASGp4r2hGzH_TrgCHMYCg/s160-c/6401011308785')
    })

    it('should make a get request', () => {
      const firstArgument = stub.args[0][0]

      expect(firstArgument).to.be.eql('get')
    })

    it('should add a header and prepared URL to the request', () => {
      const secondArgument = stub.args[0][1]

      expect(secondArgument).to.be.eql({
        headers : { 'GData-Version': "2" },
        url     : "https://picasaweb.google.com/data/feed/api/user/default?alt=json&access_token=ya29.OwJqqa1Y2tivkkCWWvA8vt5ltKsdf9cDQ5IRNrTbIt-mcfr5xNj4dQu41K6hZa7lX9O-gw"
      })
    })

  })

  describe('getPhotos', () => {
    describe('on success', () => {
      const fakeSuccessBody = {
        "feed":{
          "entry":[
            {
              "title":{
                "$t":"IMG_0327.JPG"
              },
              "content":{
                "type":"image/jpeg",
                "src":"https://lh3.googleusercontent.com/-1111111/1111/11111/1111/IMG_0327.JPG"
              }
            }
          ]
        }
      }

      let photos

      beforeEach((done) => {
        stub = sinon.stub(picasa, 'executeRequest')
        stub.callsArgWithAsync(2, null, fakeSuccessBody)

        const accessToken = 'ya29.OwJqqa1Y2tivkkCWWvA8vt5ltKsdf9cDQ5IRNrTbIt-mcfr5xNj4dQu41K6hZa7lX9O-gw'

        picasa.getPhotos(accessToken, { maxResults : 1 }, (error, photosResponse) => {
          expect(error).to.be.equals(null)
          photos = photosResponse

          done()
        })
      })

      afterEach(() => stub.restore())

      it('returns an array of photos', () => {
        expect(photos).to.be.an('Array')
      })

      it('returns a photo with its props', () => {
        expect(photos[0].title).to.be.equals('IMG_0327.JPG')
        expect(photos[0].content.src).to.contain('IMG_0327.JPG')
        expect(photos[0].content.type).to.be.equals('image/jpeg')
      })

      it('should make get request', () => {
        const firstArgument = stub.args[0][0]

        expect(firstArgument).to.be.eql('get')
      })

      it('should add header and prepared URL to request', () => {
        const secondArgument = stub.args[0][1]

        expect(secondArgument).to.be.eql({
          headers : { 'GData-Version': "2" },
          url     : "https://picasaweb.google.com/data/feed/api/user/default?alt=json&kind=photo&access_token=ya29.OwJqqa1Y2tivkkCWWvA8vt5ltKsdf9cDQ5IRNrTbIt-mcfr5xNj4dQu41K6hZa7lX9O-gw&max-results=1"
        })
      })
    })
  })

  describe('deletePhoto', () => {
    describe('on success', () => {
      let photo

      beforeEach((done) => {
        stub = sinon.stub(picasa, 'executeRequest')
        stub.callsArgWithAsync(2, null, '')

        const accessToken = 'ya29.OwJqqa1Y2tivkkCWWvA8vt5ltKsdf9cDQ5IRNrTbIt-mcfr5xNj4dQu41K6hZa7lX9O-gw'
        const albumId = 'anAlbumId'
        const photoId = 'aPhotoId'

        picasa.deletePhoto(accessToken, albumId, photoId, (error) => {
          expect(error).to.be.equals(null)

          done()
        })
      })

      afterEach(() => stub.restore())

      it('should make delete request', () => {
        const firstArgument = stub.args[0][0]

        expect(firstArgument).to.be.eql('del')
      })

      it('should prepare headers request and the URL', () => {
        const secondArgument = stub.args[0][1]

        expect(secondArgument).to.be.eql({
          "headers": {
            'If-Match': '*'
          },
          url : "https://picasaweb.google.com/data/entry/api/user/default/albumid/anAlbumId/photoid/aPhotoId?alt=json&access_token=ya29.OwJqqa1Y2tivkkCWWvA8vt5ltKsdf9cDQ5IRNrTbIt-mcfr5xNj4dQu41K6hZa7lX9O-gw"
        })
      })
    })
  })

  describe('postPhoto', () => {
    describe('on success', () => {
      const fakeSuccessBody = {
        "entry":{
          "title":{
            "$t":"IMG_0327.JPG"
          },
          "content":{
            "type":"image/jpeg",
            "src":"https://lh3.googleusercontent.com/-1111111/1111/11111/1111/IMG_0327.JPG"
          }
        }
      }
      let photo

      beforeEach((done) => {
        stub = sinon.stub(picasa, 'executeRequest')
        stub.callsArgWithAsync(2, null, fakeSuccessBody)

        const accessToken = 'ya29.OwJqqa1Y2tivkkCWWvA8vt5ltKsdf9cDQ5IRNrTbIt-mcfr5xNj4dQu41K6hZa7lX9O-gw'
        const albumId = 'anAlbumId'
        const photoData = {
          title       : 'An awesome title',
          description : 'Yolo',
          contentType : 'image/jpeg',
          binary      : 'ImaginaryBinaryContent'
        }

        picasa.postPhoto(accessToken, albumId, photoData, (error, photoResponse) => {
          expect(error).to.be.equals(null)
          photo = photoResponse

          done()
        })
      })

      afterEach(() => stub.restore())

      it('returns a photo object', () => {
        expect(photo).to.be.an('object')
      })

      it('returns a photo with its props', () => {
        expect(photo.title).to.be.equals('IMG_0327.JPG')
        expect(photo.content.src).to.contain('IMG_0327.JPG')
        expect(photo.content.type).to.be.equals('image/jpeg')
      })

      it('should make post request', () => {
        const firstArgument = stub.args[0][0]

        expect(firstArgument).to.be.eql('post')
      })

      it('should prepare a multipart request and the URL', () => {
        const secondArgument = stub.args[0][1]

        expect(secondArgument).to.be.eql({
          "multipart": [
            {
              "Content-Type": "application/atom+xml",
              "body": "<entry xmlns=\"http://www.w3.org/2005/Atom\">\n                          <title>An awesome title</title>\n                          <summary>undefined</summary>\n                          <category scheme=\"http://schemas.google.com/g/2005#kind\" term=\"http://schemas.google.com/photos/2007#photo\"/>\n                        </entry>"
            },
            {
              "Content-Type": "image/jpeg",
              "body": "ImaginaryBinaryContent"
            }
          ],
          url : "https://picasaweb.google.com/data/feed/api/user/default/albumid/anAlbumId?alt=json&access_token=ya29.OwJqqa1Y2tivkkCWWvA8vt5ltKsdf9cDQ5IRNrTbIt-mcfr5xNj4dQu41K6hZa7lX9O-gw"
        })
      })
    })
  })

  describe('getAuthURL', () => {
    it('returns valid URI', () => {
      expect(picasa.getAuthURL(config))
        .to.be.equals('https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=https%3A%2F%2Fpicasaweb.google.com%2Fdata&response_type=code&client_id=apps.google.com&redirect_uri=http%3A%2F%2Flocalhost')
    })
  })

  describe('getAccessToken', () => {
    beforeEach(() => {
      const fakeBody = {
        access_token : 'ya29.KwLDeXsw1jNAavZ8jEMFgikhDg_CnUX1oMr5RQUyeqTBf229YV4HzhhXvRgBBvFGqTqxdw',
        token_type   : 'Bearer',
        expires_in   : 3580
      }

      stub = sinon.stub(picasa, 'executeRequest')

      stub.callsArgWithAsync(2, null, fakeBody)
    })

    afterEach(() => stub.restore())

    it('returns access token response', (done) => {
      picasa.getAccessToken(config, '4/DxoCTw8Rf3tQAAW94h6lK7ioEjnu6K8kEqVZ0d-cRA8', (error, accessToken) => {
        expect(stub).to.have.been.calledWith('post', { url : 'https://www.googleapis.com/oauth2/v3/token?grant_type=authorization_code&code=4%2FDxoCTw8Rf3tQAAW94h6lK7ioEjnu6K8kEqVZ0d-cRA8&redirect_uri=http%3A%2F%2Flocalhost&client_id=apps.google.com&client_secret=client_secretABC' })

        expect(error).to.be.equal(null)
        expect(accessToken).to.be.equals('ya29.KwLDeXsw1jNAavZ8jEMFgikhDg_CnUX1oMr5RQUyeqTBf229YV4HzhhXvRgBBvFGqTqxdw')

        done()
      })
    })
  })
})
