import { searchController } from '~/src/server/applicant/search/controller.js'

/**
 * Sets up the routes for the search page.
 * @satisfies {ServerRegisterPluginObject<void>}
 */
export const search = {
  plugin: {
    name: 'search',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/applicant/search',
          ...searchController.get
        },
        {
          method: 'POST',
          path: '/applicant/search',
          ...searchController.post
        }
      ])
    }
  }
}

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
