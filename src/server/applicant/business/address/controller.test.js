import { createServer } from '~/src/server/index.js'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'

describe('#businessAddressController', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  describe('GET /applicant/business/address', () => {
    test('Should return 200 and render page', async () => {
      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/applicant/business/address'
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain('What is your business address?')
    })

    test('Should display saved address from session', async () => {
      const testAddress = {
        addressLine1: '123 Test Street',
        addressLine2: 'Test Area',
        addressTown: 'Testville',
        addressCounty: 'Testshire',
        addressPostcode: 'TE5 7ST'
      }

      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/applicant/business/address',
        auth: {
          credentials: {},
          strategy: 'session'
        },
        state: {
          session: testAddress
        }
      })

      expect(statusCode).toBe(statusCodes.ok)
      Object.values(testAddress).forEach(value => {
        expect(result).toContain(value)
      })
    })
  })

  describe('POST /applicant/business/address', () => {
    test('Should return 400 when required fields are missing', async () => {
      const { result, statusCode } = await server.inject({
        method: 'POST',
        url: '/applicant/business/address',
        payload: {
          addressLine1: '',
          addressLine2: '',
          addressTown: '',
          addressCounty: '',
          addressPostcode: ''
        }
      })

      expect(statusCode).toBe(statusCodes.badRequest)
      expect(result).toContain('Enter building and street')
      expect(result).toContain('Enter town or city')
      expect(result).toContain('Enter a postcode')
    })

    test('Should return 400 when postcode is invalid', async () => {
      const { result, statusCode } = await server.inject({
        method: 'POST',
        url: '/applicant/business/address',
        payload: {
          addressLine1: '123 Test Street',
          addressLine2: '',
          addressTown: 'Testville',
          addressCounty: 'Testshire',
          addressPostcode: 'INVALID'
        }
      })

      expect(statusCode).toBe(statusCodes.badRequest)
      expect(result).toContain('Enter a real postcode')
    })

    test('Should save address to session and redirect when valid', async () => {
      const validAddress = {
        addressLine1: '123 Test Street',
        addressLine2: 'Test Area',
        addressTown: 'Testville',
        addressCounty: 'Testshire',
        addressPostcode: 'TE5 7ST'
      }

      const { statusCode, headers } = await server.inject({
        method: 'POST',
        url: '/applicant/business/address',
        payload: validAddress
      })

      expect(statusCode).toBe(statusCodes.found)
      expect(headers.location).toBe('/applicant/business/address')
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */ 