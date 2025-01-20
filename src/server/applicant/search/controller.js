import Joi from 'joi'
import { proxyFetch } from '~/src/server/common/helpers/proxy.js'
import { config } from '~/src/config/config.js'

const schema = Joi.object({
  referenceNumber: Joi.string()
    .required()
    .pattern(/^APP-[A-Z0-9]{4}-[A-Z0-9]{4}$/)
    .messages({
      'string.empty': 'Enter a reference number',
      'string.pattern.base': 'Enter a reference number in the correct format',
      'any.required': 'Enter a reference number'
    })
})

/**
 * @satisfies {Partial<ServerRoute>}
 */
export const searchController = {
  get: {
    handler: (request, h) => {
      return h.view('applicant/search/index', {
        pageTitle: 'Search applications',
        heading: 'Search applications'
      })
    }
  },

  post: {
    handler: async (request, h) => {
      const { referenceNumber } = request.payload

      try {
        const validation = schema.validate(
          { referenceNumber },
          { abortEarly: false }
        )

        if (validation.error) {
          return h.view('applicant/search/index', {
            pageTitle: 'Search applications',
            heading: 'Search applications',
            referenceNumber,
            errors: {
              referenceNumber: {
                text: validation.error.details[0].message
              }
            }
          })
        }

        const response = await proxyFetch(
          `${config.get('backendUrl')}/applicant/${referenceNumber}`
        )

        if (!response.ok) {
          return h.view('applicant/search/index', {
            pageTitle: 'Search applications',
            heading: 'Search applications',
            referenceNumber,
            errors: {
              referenceNumber: {
                text: 'No application found with this reference number'
              }
            }
          })
        }

        const data = await response.json()

        return h.view('applicant/search/index', {
          pageTitle: 'Search applications',
          heading: 'Search applications',
          referenceNumber,
          searchResult: data.applicant
        })
      } catch (err) {
        request.log('error', err)
        return h.view('applicant/search/index', {
          pageTitle: 'Search applications',
          heading: 'Search applications',
          referenceNumber,
          errors: {
            referenceNumber: {
              text: 'Error searching for application'
            }
          }
        })
      }
    }
  }
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
