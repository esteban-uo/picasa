'use strict'

const chai   = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const rewire = require('rewire')

const expect = chai.expect
chai.use(sinonChai)

const executeRequest = rewire('./executeRequest')

describe('executeRequest', () => {
  let getMock, postMock, stubExecuteRequest

  beforeEach(() => {
    getMock = sinon.mock()
    postMock = sinon.mock()

    executeRequest.__set__('request', {
      post : postMock,
      get  : getMock,
    })
  })

  describe('on status code between 200 and 226', () => {
    describe('on status code 200 with body', () => {
      beforeEach(() => {
        const body = '{"photoId":1}'
        const response = { statusCode : 200 }

        getMock.callsArgWithAsync(1, null, response, body)
      })

      it('should return an object', (done) => {
        executeRequest('get', {}, (error, response) => {
          expect(error).to.be.equals(null)

          expect(response).to.be.an('object')
          expect(response.photoId).to.be.eq(1)

          done()
        })
      })
    })

    describe('on status code 200 without body', () => {
      beforeEach(() => {
        const body = ''
        const response = { statusCode : 200 }

        getMock.callsArgWithAsync(1, null, response, body)
      })

      it('should return error and response undefined', (done) => {
        executeRequest('get', {}, (error, response) => {
          expect(error).to.be.equals(undefined)

          expect(response).to.be.eq(undefined)

          done()
        })
      })
    })
  })

  describe('on status code < 200 and status code > 226', () => {
    describe('on error 403', () => {
      beforeEach(() => {
        const body = 'weird error'
        const response = { statusCode : 403 }

        getMock.callsArgWithAsync(1, null, response, body)
      })

      it('should return an error from the body', (done) => {
        executeRequest('get', {}, (error, response) => {
          expect(error.statusCode).to.be.equals(403)
          expect(error.body).to.be.equals('weird error')
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
