import { NotifyClient } from 'notifications-node-client'
import { config } from '~/src/config/config.js'

const notifyClient = new NotifyClient(config.get('notifyApiKey'))

export async function sendConfirmationEmail(emailAddress, personalisation) {
  const templateId = config.get('notifyTemplateId')

  return await notifyClient.sendEmail(templateId, emailAddress, {
    personalisation,
    reference: personalisation.referenceNumber
  })
}
