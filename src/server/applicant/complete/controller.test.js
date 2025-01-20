import { createServer } from '~/src/server/index.js'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'
import { sendConfirmationEmail } from '~/src/server/lib/notify.js'

// Mock the notify service
jest.mock('~/src/server/lib/notify.js', () => ({
  sendConfirmationEmail: jest.fn()
}))

describe('#completeController', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /applicant/complete', () => {
    const mockSessionData = {
      applicant: {
        name: 'John Smith',
        email: 'test@example.com',
        business: {
          name: 'Test Business Ltd'
        }
      }
    }

    test('Should return 200 and render completion page', async () => {
      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/applicant/complete',
        auth: {
          credentials: {},
          strategy: 'session'
        },
        state: {
          session: {
            sessionData: mockSessionData
          }
        }
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain('Application complete')
      expect(result).toMatch(/APP-[A-Z0-9]{4}-[A-Z0-9]{4}/)
      expect(result).toContain(mockSessionData.applicant.email)
    })

    test('Should send confirmation email on first visit', async () => {
      sendConfirmationEmail.mockResolvedValueOnce({
        id: 'test-notification-id'
      })

      await server.inject({
        method: 'GET',
        url: '/applicant/complete',
        auth: {
          credentials: {},
          strategy: 'session'
        },
        state: {
          session: {
            sessionData: mockSessionData
          }
        }
      })

      expect(sendConfirmationEmail).toHaveBeenCalledWith(
        mockSessionData.applicant.email,
        expect.objectContaining({
          applicantName: mockSessionData.applicant.name,
          businessName: mockSessionData.applicant.business.name,
          referenceNumber: expect.stringMatching(/APP-[A-Z0-9]{4}-[A-Z0-9]{4}/)
        })
      )
    })

    test('Should not send email if reference number already exists', async () => {
      const existingReference = 'APP-TEST-1234'
      await server.inject({
        method: 'GET',
        url: '/applicant/complete',
        auth: {
          credentials: {},
          strategy: 'session'
        },
        state: {
          session: {
            sessionData: {
              applicant: {
                ...mockSessionData.applicant,
                referenceNumber: existingReference
              }
            }
          }
        }
      })

      expect(sendConfirmationEmail).not.toHaveBeenCalled()
    })

    test('Should handle email sending failure gracefully', async () => {
      sendConfirmationEmail.mockRejectedValueOnce(new Error('Notify API error'))

      const { statusCode, result } = await server.inject({
        method: 'GET',
        url: '/applicant/complete',
        auth: {
          credentials: {},
          strategy: 'session'
        },
        state: {
          session: {
            sessionData: mockSessionData
          }
        }
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain('Application complete')
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
