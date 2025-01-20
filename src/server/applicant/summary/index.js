import { summaryController } from '~/src/server/applicant/summary/controller.js'

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
