'use strict'

const chai   = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const rewire = require('rewire')

const expect = chai.expect
chai.use(sinonChai)

const picasaRequest = rewire('./picasaRequest')

describe('picasaRequest', () => {
  let getMock, postMock

  beforeEach(() => {
    getMock = sinon.mock()
    postMock = sinon.mock()

    picasaRequest.__set__('request', {
      post : postMock,
      get  : getMock,
    })
  })

  describe('on status code different than 200', () => {
    describe('on error 403', () => {
      beforeEach(() => {
        const body = 'weird error'
        const response = { statusCode : 403 }

        getMock.callsArgWithAsync(1, null, response, body)
      })

      it('should return an error from the body', (done) => {
        picasaRequest('get', {}, (error, response) => {
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
        picasaRequest('get', {}, (error, photos) => {
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
