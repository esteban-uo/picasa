'use strict'

const chai   = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const rewire = require('rewire')

const expect = chai.expect
chai.use(sinonChai)

const request = rewire('./request')

describe('request', () => {
  let getMock, postMock, stubExecuteRequest

  beforeEach(() => {
    getMock = sinon.mock()
    postMock = sinon.mock()

    request.__set__('request', {
      post : postMock,
      get  : getMock,
    })
  })

  describe('picasaRequest', () => {
    const picasaRequest = request.picasaRequest

    beforeEach((done) => {
      stubExecuteRequest = sinon.stub()

      request.__set__('executeRequest', stubExecuteRequest)
      stubExecuteRequest.callsArgWithAsync(2, null, 'aaaaa')

      picasaRequest('aaaaa', 'post', 'photos',{}, done)
    })

    it('should request verb given', () => {
      const firstArgument = stubExecuteRequest.args[0][0]

      expect(firstArgument).to.be.eql('post')
    })

    it('should prepare header and url with access token given', () => {
      const secondArgument = stubExecuteRequest.args[0][1]

      expect(secondArgument).to.be.eql({
        headers : { 'GData-Version': "2" },
        url     : "https://picasaweb.google.com/data/feed/api/user/default?alt=json&kind=photos&access_token=aaaaa"
      })
    })
  })

  describe('executeRequest', () => {
    const executeRequest = request.executeRequest

    describe('on status code different than 200', () => {
      describe('on error 403', () => {
        beforeEach(() => {
          const body = 'weird error'
          const response = { statusCode : 403 }

          getMock.callsArgWithAsync(1, null, response, body)
        })

        it('should return an error from the body', (done) => {
          executeRequest('get', {}, (error, response) => {
            expect(error.message).to.be.equals('weird error')
            expect(response).to.be.equals(undefined)

            done()
          })
        })
      })

      describe('on unknown error code', () => {
        beforeEach(() => {
          const body = '<html>Nasty error</html>'
          const response = { statusCode : 500 }

          getMock.callsArgWithAsync(1, null, response, body)
        })

        it('should return an error from the body', () => {
          executeRequest('get', {}, (error, photos) => {
            expect(error.message).to.be.equals('UNKNOWN_ERROR')
            expect(error.body).to.be.equals('<html>Nasty error</html>')
            expect(error.statusCode).to.be.equals(500)
            expect(photos).to.be.equals(null)

            done()
          })
        })
      })
    })
  })
})
