import { SessionManager } from '~/src/server/lib/session-manager.js'
import { generateReference } from '~/src/server/lib/reference-generator.js'
import { sendConfirmationEmail } from '~/src/server/lib/notify.js'
import { proxyFetch } from '~/src/server/common/helpers/proxy.js'
import { config } from '~/src/config/config.js'

/**
 * @satisfies {Partial<ServerRoute>}
 */
export const completeController = {
  get: {
    handler: async (request, h) => {
      const session = new SessionManager(request)

      // Get application details
      const applicantName = session.get('applicant.name')
      const applicantEmail = session.get('applicant.email')
      const businessName = session.get('applicant.business.name')
      const businessAddress = session.get('applicant.business.address')

      // Generate and save reference number if not exists
      let referenceNumber = session.get('applicant.referenceNumber')
      if (!referenceNumber) {
        referenceNumber = generateReference()
        session.set('applicant.referenceNumber', referenceNumber)

        // Prepare application data
        const applicationData = {
          referenceNumber,
          applicant: {
            name: applicantName,
            email: applicantEmail,
            business: {
              name: businessName,
              address: businessAddress
            }
          },
          submittedAt: new Date().toISOString()
        }

        try {
          // Submit application using proxy helper
          const response = await proxyFetch(
            config.get('backendUrl') + '/applicant',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(applicationData)
            }
          )

          if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`)
          }

          // Send confirmation email only after successful submission
          await sendConfirmationEmail(applicantEmail, {
            applicantName,
            businessName,
            referenceNumber
          })
        } catch (err) {
          // Log error but don't fail the request
          request.log('error', `Failed to process application: ${err.message}`)
        }
      }

      return h.view('applicant/complete/index', {
        pageTitle: 'Application complete',
        referenceNumber,
        applicantEmail,
        applicantName,
        businessName
      })
    }
  }
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
