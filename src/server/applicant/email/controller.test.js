import { createServer } from '~/src/server/index.js'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'

describe('#emailController', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  describe('GET /applicant/email', () => {
    test('Should return 200 and render page', async () => {
      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/applicant/email'
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain('What is your email address?')
    })

    test('Should display saved email from session', async () => {
      const testEmail = 'test@example.com'
      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/applicant/email',
        auth: {
          credentials: {},
          strategy: 'session'
        },
        state: {
          session: {
            applicantEmail: testEmail
          }
        }
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain(testEmail)
    })
  })

  describe('POST /applicant/email', () => {
    test('Should return 400 when no email provided', async () => {
      const { result, statusCode } = await server.inject({
        method: 'POST',
        url: '/applicant/email',
        payload: {
          applicantEmail: ''
        }
      })

      expect(statusCode).toBe(statusCodes.badRequest)
      expect(result).toContain('Enter your email address')
    })

    test('Should return 400 when invalid email provided', async () => {
      const { result, statusCode } = await server.inject({
        method: 'POST',
        url: '/applicant/email',
        payload: {
          applicantEmail: 'not-an-email'
        }
      })

      expect(statusCode).toBe(statusCodes.badRequest)
      expect(result).toContain('Enter a valid email address')
    })

    test('Should save email to session and redirect when valid', async () => {
      const { statusCode, headers } = await server.inject({
        method: 'POST',
        url: '/applicant/email',
        payload: {
          applicantEmail: 'test@example.com'
        }
      })

      expect(statusCode).toBe(statusCodes.found)
      expect(headers.location).toBe('/applicant/email')
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
