import { SessionManager } from '~/src/server/lib/session-manager.js'
import { generateReference } from '~/src/server/lib/reference-generator.js'
import { sendConfirmationEmail } from '~/src/server/lib/notify.js'

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

      // Generate and save reference number if not exists
      let referenceNumber = session.get('applicant.referenceNumber')
      if (!referenceNumber) {
        referenceNumber = generateReference()
        session.set('applicant.referenceNumber', referenceNumber)

        // Send confirmation email
        try {
          await sendConfirmationEmail(applicantEmail, {
            applicantName,
            businessName,
            referenceNumber
          })
        } catch (err) {
          // Log error but don't fail the request
          request.log(
            'error',
            `Failed to send confirmation email: ${err.message}`
          )
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
