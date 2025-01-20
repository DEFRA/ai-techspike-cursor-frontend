import Joi from 'joi'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'
import { SessionManager } from '~/src/server/lib/session-manager.js'

const schema = Joi.object({
  applicantEmail: Joi.string().email({ tlds: false }).required().messages({
    'string.empty': 'Enter your email address',
    'string.email': 'Enter a valid email address',
    'any.required': 'Enter your email address'
  })
})

/**
 * @satisfies {Partial<ServerRoute>}
 */
export const emailController = {
  get: {
    handler: (request, h) => {
      const session = new SessionManager(request)
      const applicantEmail = session.get('applicant.email')

      return h.view('applicant/email/index', {
        pageTitle: 'Email address',
        heading: 'What is your email address?',
        applicantEmail,
        errors: {}
      })
    }
  },
  post: {
    handler: async (request, h) => {
      const { applicantEmail } = request.payload
      const session = new SessionManager(request)

      const { error } = schema.validate({ applicantEmail }, { abortEarly: false })

      if (error) {
        return h
          .view('applicant/email/index', {
            pageTitle: 'Email address',
            heading: 'What is your email address?',
            applicantEmail,
            errors: {
              applicantEmail: {
                text: error.details[0].message
              }
            }
          })
          .code(statusCodes.badRequest)
      }

      session.set('applicant.email', applicantEmail)
      return h.redirect('/applicant/summary')
    }
  }
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */ 