import { createServer } from '~/src/server/index.js'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'

describe('#summaryController', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  describe('GET /applicant/summary', () => {
    test('Should return 200 and render page', async () => {
      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/applicant/summary'
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain('Application summary')
      expect(result).toContain('Your details')
      expect(result).toContain('Business details')
    })

    test('Should show incomplete status when no session data', async () => {
      const { result } = await server.inject({
        method: 'GET',
        url: '/applicant/summary'
      })

      const notStartedCount = (result.match(/Not started/g) || []).length
      expect(notStartedCount).toBe(4) // All tasks should show as not started
      expect(result).not.toContain('Continue to declaration')
    })

    test('Should show completed status for filled sections', async () => {
      const { result } = await server.inject({
        method: 'GET',
        url: '/applicant/summary',
        auth: {
          credentials: {},
          strategy: 'session'
        },
        state: {
          session: {
            sessionData: {
              applicant: {
                name: 'John Smith',
                email: 'john@example.com',
                business: {
                  name: 'Test Business',
                  address: {
                    addressLine1: '123 Test Street',
                    addressTown: 'Testville',
                    addressPostcode: 'TE1 1ST'
                  }
                }
              }
            }
          }
        }
      })

      const completedCount = (result.match(/Completed/g) || []).length
      expect(completedCount).toBe(4) // All tasks should show as completed
      expect(result).toContain('Continue to declaration')
    })

    test('Should show correct links to sections', async () => {
      const { result } = await server.inject({
        method: 'GET',
        url: '/applicant/summary'
      })

      const expectedPaths = [
        '/applicant/name',
        '/applicant/email',
        '/applicant/business/name',
        '/applicant/business/address'
      ]

      expectedPaths.forEach(path => {
        expect(result).toContain(`href="${path}"`)
      })
    })

    test('Should show partially completed sections correctly', async () => {
      const { result } = await server.inject({
        method: 'GET',
        url: '/applicant/summary',
        auth: {
          credentials: {},
          strategy: 'session'
        },
        state: {
          session: {
            sessionData: {
              applicant: {
                name: 'John Smith',
                email: '',
                business: {
                  name: 'Test Business',
                  address: {
                    addressLine1: ''
                  }
                }
              }
            }
          }
        }
      })

      const completedCount = (result.match(/Completed/g) || []).length
      const notStartedCount = (result.match(/Not started/g) || []).length
      expect(completedCount).toBe(2) // Two tasks completed
      expect(notStartedCount).toBe(2) // Two tasks not started
      expect(result).not.toContain('Continue to declaration') // Not all complete
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */ 