import inert from '@hapi/inert'

import { health } from '~/src/server/health/index.js'
import { home } from '~/src/server/home/index.js'
import { serveStaticFiles } from '~/src/server/common/helpers/serve-static-files.js'
import { about } from '~/src/server/about/index.js'
import { applicant } from '~/src/server/applicant/name/index.js'
import { email } from '~/src/server/applicant/email/index.js'
import { businessAddress } from '~/src/server/applicant/business/address/index.js'
import { businessName } from '~/src/server/applicant/business/name/index.js'
import { summary } from '~/src/server/applicant/summary/index.js'
import { complete } from '~/src/server/applicant/complete/index.js'

/**
 * @satisfies {ServerRegisterPluginObject<void>}
 */
export const router = {
  plugin: {
    name: 'router',
    async register(server) {
      await server.register([inert])

      // Health-check route. Used by platform to check if service is running, do not remove!
      await server.register([health])

      // Application specific routes, add your own routes here
      await server.register([home, about, applicant, email, businessAddress, businessName, summary, complete])

      // Static assets
      await server.register([serveStaticFiles])
    }
  }
}

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
