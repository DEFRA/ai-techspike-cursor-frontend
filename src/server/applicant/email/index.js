import { emailController } from '~/src/server/applicant/email/controller.js'

/**
 * Sets up the routes for the applicant email page.
 * @satisfies {ServerRegisterPluginObject<void>}
 */
export const email = {
  plugin: {
    name: 'applicant-email',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/applicant/email',
          ...emailController.get
        },
        {
          method: 'POST',
          path: '/applicant/email',
          ...emailController.post
        }
      ])
    }
  }
}

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */ 