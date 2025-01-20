import { businessNameController } from '~/src/server/applicant/business/name/controller.js'

/**
 * Sets up the routes for the business name page.
 * @satisfies {ServerRegisterPluginObject<void>}
 */
export const businessName = {
  plugin: {
    name: 'business-name',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/applicant/business/name',
          ...businessNameController.get
        },
        {
          method: 'POST',
          path: '/applicant/business/name',
          ...businessNameController.post
        }
      ])
    }
  }
}

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
