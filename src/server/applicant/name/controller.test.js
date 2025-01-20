import { createServer } from '~/src/server/index.js'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'

describe('#applicantController', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  describe('GET /applicant', () => {
    test('Should return 200 and render page', async () => {
      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/applicant'
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain('What is your name?')
    })

    test('Should display saved name from session', async () => {
      const testName = 'John Smith'
      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/applicant',
        auth: {
          credentials: {},
          strategy: 'session'
        },
        state: {
          session: {
            applicantName: testName
          }
        }
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain(testName)
    })
  })

  describe('POST /applicant', () => {
    test('Should return 400 when no name provided', async () => {
      const { result, statusCode } = await server.inject({
        method: 'POST',
        url: '/applicant',
        payload: {
          applicantName: ''
        }
      })

      expect(statusCode).toBe(statusCodes.badRequest)
      expect(result).toContain('Enter your name')
    })

    test('Should return 400 when name too short', async () => {
      const { result, statusCode } = await server.inject({
        method: 'POST',
        url: '/applicant',
        payload: {
          applicantName: 'A'
        }
      })

      expect(statusCode).toBe(statusCodes.badRequest)
      expect(result).toContain('Name must be at least 2 characters')
    })

    test('Should save name to session and redirect when valid', async () => {
      const { statusCode, headers } = await server.inject({
        method: 'POST',
        url: '/applicant',
        payload: {
          applicantName: 'John Smith'
        }
      })

      expect(statusCode).toBe(statusCodes.found)
      expect(headers.location).toBe('/applicant')
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */ 