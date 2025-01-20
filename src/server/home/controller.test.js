import { createServer } from '~/src/server/index.js'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'

describe('#homeController', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  describe('GET /', () => {
    test('Should return 200 and render start page', async () => {
      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/'
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain('Before you start')
      expect(result).toContain('href="/applicant/name"')
      expect(result).toContain('Start')
    })

    test('Should clear session when landing on start page', async () => {
      const { result } = await server.inject({
        method: 'GET',
        url: '/',
        auth: {
          credentials: {},
          strategy: 'session'
        },
        state: {
          session: {
            sessionData: {
              applicant: {
                name: 'Test Name',
                email: 'test@example.com'
              }
            }
          }
        }
      })

      // Verify the page renders correctly
      expect(result).toContain('Before you start')

      // Make a subsequent request to verify session is cleared
      const { result: subsequentResult } = await server.inject({
        method: 'GET',
        url: '/applicant/summary',
        auth: {
          credentials: {},
          strategy: 'session'
        }
      })

      expect(subsequentResult).not.toContain('Test Name')
      expect(subsequentResult).toContain('Not started')
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
