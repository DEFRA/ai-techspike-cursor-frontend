import { createServer } from '~/src/server/index.js'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'
import { proxyFetch } from '~/src/server/common/helpers/proxy.js'

jest.mock('~/src/server/common/helpers/proxy.js')

describe('#searchController', () => {
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

  describe('GET /applicant/search', () => {
    test('Should return 200 and render search page', async () => {
      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/applicant/search'
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain('Search applications')
    })
  })

  describe('POST /applicant/search', () => {
    const mockApplicationData = {
      message: 'success',
      applicant: {
        referenceNumber: 'APP-TEST-1234',
        applicant: {
          name: 'Test User',
          email: 'test@example.com',
          business: {
            name: 'Test Business',
            address: {
              addressLine1: '123 Test St',
              addressLine2: '',
              addressTown: 'Testville',
              addressCounty: 'Testshire',
              addressPostcode: 'TE1 1ST'
            }
          }
        },
        submittedAt: '2025-01-20T18:45:47.163Z'
      }
    }

    test('Should validate reference number format', async () => {
      const { result, statusCode } = await server.inject({
        method: 'POST',
        url: '/applicant/search',
        payload: {
          referenceNumber: 'invalid'
        }
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain('Enter a reference number in the correct format')
    })

    test('Should display application details when found', async () => {
      proxyFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApplicationData)
      })

      const { result, statusCode } = await server.inject({
        method: 'POST',
        url: '/applicant/search',
        payload: {
          referenceNumber: 'APP-TEST-1234'
        }
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain(mockApplicationData.applicant.applicant.name)
      expect(result).toContain(
        mockApplicationData.applicant.applicant.business.name
      )
    })

    test('Should handle not found applications', async () => {
      proxyFetch.mockResolvedValueOnce({
        ok: false
      })

      const { result, statusCode } = await server.inject({
        method: 'POST',
        url: '/applicant/search',
        payload: {
          referenceNumber: 'APP-TEST-1234'
        }
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain(
        'No application found with this reference number'
      )
    })

    test('Should handle API errors', async () => {
      proxyFetch.mockRejectedValueOnce(new Error('API Error'))

      const { result, statusCode } = await server.inject({
        method: 'POST',
        url: '/applicant/search',
        payload: {
          referenceNumber: 'APP-TEST-1234'
        }
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toContain('Error searching for application')
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
