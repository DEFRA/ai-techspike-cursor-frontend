import { businessAddressController } from '~/src/server/applicant/business/address/controller.js'

/**
 * Sets up the routes for the business address page.
 * @satisfies {ServerRegisterPluginObject<void>}
 */
export const businessAddress = {
  plugin: {
    name: 'business-address',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/applicant/business/address',
          ...businessAddressController.get
        },
        {
          method: 'POST',
          path: '/applicant/business/address',
          ...businessAddressController.post
        }
      ])
    }
  }
}

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */ 