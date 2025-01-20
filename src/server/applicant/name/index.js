import { applicantController } from '~/src/server/applicant/name/controller.js'

/**
 * Sets up the routes for the applicant page.
 * @satisfies {ServerRegisterPluginObject<void>}
 */
export const applicant = {
  plugin: {
    name: 'applicant',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/applicant/name',
          ...applicantController.get
        },
        {
          method: 'POST',
          path: '/applicant/name',
          ...applicantController.post
        }
      ])
    }
  }
}

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
