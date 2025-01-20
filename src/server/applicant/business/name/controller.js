import Joi from 'joi'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'
import { SessionManager } from '~/src/server/lib/session-manager.js'

const schema = Joi.object({
  businessName: Joi.string().required().min(2).max(100).messages({
    'string.empty': 'Enter your business name',
    'string.min': 'Business name must be at least 2 characters',
    'string.max': 'Business name must be no more than 100 characters'
  })
})

/**
 * @satisfies {Partial<ServerRoute>}
 */
export const businessNameController = {
  get: {
    handler: (request, h) => {
      const session = new SessionManager(request)
      const businessName = session.get('applicant.business.name')

      return h.view('applicant/business/name/index', {
        pageTitle: 'Business name',
        heading: 'What is your business name?',
        businessName,
        errors: {}
      })
    }
  },
  post: {
    handler: (request, h) => {
      const { businessName } = request.payload
      const session = new SessionManager(request)

      const { error } = schema.validate({ businessName }, { abortEarly: false })

      if (error) {
        return h
          .view('applicant/business/name/index', {
            pageTitle: 'Business name',
            heading: 'What is your business name?',
            businessName,
            errors: {
              businessName: {
                text: error.details[0].message
              }
            }
          })
          .code(statusCodes.badRequest)
      }

      session.set('applicant.business.name', businessName)
      return h.redirect('/applicant/business/address')
    }
  }
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
