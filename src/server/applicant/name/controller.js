import Joi from 'joi'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'
import { SessionManager } from '~/src/server/lib/session-manager.js'

const schema = Joi.object({
  applicantName: Joi.string().required().min(2).max(100).messages({
    'string.empty': 'Enter your name',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must be no more than 100 characters'
  })
})

/**
 * @satisfies {Partial<ServerRoute>}
 */
export const applicantController = {
  get: {
    handler: (request, h) => {
      const session = new SessionManager(request)
      const applicantName = session.get('applicant.name')

      return h.view('applicant/name/index', {
        pageTitle: 'Applicant details',
        heading: 'What is your name?',
        applicantName,
        errors: {}
      })
    }
  },
  post: {
    handler: async (request, h) => {
      const { applicantName } = request.payload
      const session = new SessionManager(request)

      const { error } = schema.validate({ applicantName }, { abortEarly: false })

      if (error) {
        return h
          .view('applicant/name/index', {
            pageTitle: 'Applicant details',
            heading: 'What is your name?',
            applicantName,
            errors: {
              applicantName: {
                text: error.details[0].message
              }
            }
          })
          .code(statusCodes.badRequest)
      }

      session.set('applicant.name', applicantName)
      return h.redirect('/applicant/email')
    }
  }
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */ 