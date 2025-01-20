import { NotifyClient } from 'notifications-node-client'
import { config } from '~/src/config/config.js'
import { provideProxy } from '../common/helpers/proxy.js'

const notifyClient = new NotifyClient(config.get('notifyApiKey'))
const proxy = provideProxy()

if (proxy) {
  const proxyConfig = {
    host: proxy.url,
    port: proxy.port
  }

  notifyClient.setProxy(proxyConfig)
}

export async function sendConfirmationEmail(emailAddress, personalisation) {
  const templateId = config.get('notifyTemplateId')

  return await notifyClient.sendEmail(templateId, emailAddress, {
    personalisation,
    reference: personalisation.referenceNumber
  })
}
