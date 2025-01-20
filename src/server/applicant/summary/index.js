import { summaryController } from '~/src/server/applicant/summary/controller.js'

/**
 * Sets up the routes for the summary page.
 * @satisfies {ServerRegisterPluginObject<void>}
 */
export const summary = {
  plugin: {
    name: 'summary',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/applicant/summary',
          ...summaryController.get
        }
      ])
    }
  }
}

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */ 