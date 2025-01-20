import { createServer } from '~/src/server/index.js'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'

describe('#businessNameController', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  describe('GET /applicant/business/name', () => {
    test('Should return 200 and render page', async () => {
      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/applicant/business/name'
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain('What is your business name?')
    })

    test('Should display saved business name from session', async () => {
      const testBusinessName = 'Test Business Ltd'
      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/applicant/business/name',
        auth: {
          credentials: {},
          strategy: 'session'
        },
        state: {
          session: {
            sessionData: {
              applicant: {
                business: {
                  name: testBusinessName
                }
              }
            }
          }
        }
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain(testBusinessName)
    })
  })

  describe('POST /applicant/business/name', () => {
    test('Should return 400 when no business name provided', async () => {
      const { result, statusCode } = await server.inject({
        method: 'POST',
        url: '/applicant/business/name',
        payload: {
          businessName: ''
        }
      })

      expect(statusCode).toBe(statusCodes.badRequest)
      expect(result).toContain('Enter your business name')
    })

    test('Should return 400 when business name too short', async () => {
      const { result, statusCode } = await server.inject({
        method: 'POST',
        url: '/applicant/business/name',
        payload: {
          businessName: 'A'
        }
      })

      expect(statusCode).toBe(statusCodes.badRequest)
      expect(result).toContain('Business name must be at least 2 characters')
    })

    test('Should save business name to session and redirect when valid', async () => {
      const { statusCode, headers } = await server.inject({
        method: 'POST',
        url: '/applicant/business/name',
        payload: {
          businessName: 'Test Business Ltd'
        }
      })

      expect(statusCode).toBe(statusCodes.found)
      expect(headers.location).toBe('/applicant/business/name')
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */ 