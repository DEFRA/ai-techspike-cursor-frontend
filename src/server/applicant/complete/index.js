import { completeController } from '~/src/server/applicant/complete/controller.js'

/**
 * Sets up the routes for the complete page.
 * @satisfies {ServerRegisterPluginObject<void>}
 */
export const complete = {
  plugin: {
    name: 'complete',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/applicant/complete',
          ...completeController.get
        }
      ])
    }
  }
}

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */ 