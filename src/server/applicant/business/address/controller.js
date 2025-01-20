import Joi from 'joi'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'
import { SessionManager } from '~/src/server/lib/session-manager.js'

const schema = Joi.object({
  addressLine1: Joi.string().required().max(100).messages({
    'string.empty': 'Enter building and street',
    'string.max': 'Building and street must be 100 characters or fewer'
  }),
  addressLine2: Joi.string().allow('').max(100).messages({
    'string.max': 'Building and street line 2 must be 100 characters or fewer'
  }),
  addressTown: Joi.string().required().max(100).messages({
    'string.empty': 'Enter town or city',
    'string.max': 'Town or city must be 100 characters or fewer'
  }),
  addressCounty: Joi.string().allow('').max(100).messages({
    'string.max': 'County must be 100 characters or fewer'
  }),
  addressPostcode: Joi.string().required().pattern(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i).messages({
    'string.empty': 'Enter a postcode',
    'string.pattern.base': 'Enter a real postcode'
  })
})

/**
 * @satisfies {Partial<ServerRoute>}
 */
export const businessAddressController = {
  get: {
    handler: (request, h) => {
      const session = new SessionManager(request)
      
      const addressLine1 = session.get('applicant.business.address.addressLine1')
      const addressLine2 = session.get('applicant.business.address.addressLine2')
      const addressTown = session.get('applicant.business.address.addressTown')
      const addressCounty = session.get('applicant.business.address.addressCounty')
      const addressPostcode = session.get('applicant.business.address.addressPostcode')

      return h.view('applicant/business/address/index', {
        pageTitle: 'Business address',
        heading: 'What is your business address?',
        addressLine1,
        addressLine2,
        addressTown,
        addressCounty,
        addressPostcode,
        errors: {}
      })
    }
  },
  post: {
    handler: async (request, h) => {
      const payload = request.payload
      const session = new SessionManager(request)

      const { error } = schema.validate(payload, { abortEarly: false })

      if (error) {
        return h
          .view('applicant/business/address/index', {
            pageTitle: 'Business address',
            heading: 'What is your business address?',
            ...payload,
            errors: error.details.reduce((acc, err) => {
              acc[err.path[0]] = {
                text: err.message
              }
              return acc
            }, {})
          })
          .code(statusCodes.badRequest)
      }

      // Save all address fields to session
      Object.entries(payload).forEach(([key, value]) => {
        session.set(`applicant.business.address.${key}`, value)
      })

      return h.redirect('/applicant/summary')
    }
  }
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */ 