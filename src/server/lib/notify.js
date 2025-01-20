import { NotifyClient } from 'notifications-node-client'
import { config } from '~/src/config/config.js'

const notifyClient = new NotifyClient(config.get('notifyApiKey'))

/**
 * Sends an application confirmation email
 * @param {string} emailAddress - Recipient's email address
 * @param {Object} personalisation - Template personalisation data
 * @returns {Promise} - Notify API response
 */
export async function sendConfirmationEmail(emailAddress, personalisation) {
  const templateId = config.get('notifyTemplateId')

  try {
    return await notifyClient.sendEmail(templateId, emailAddress, {
      personalisation,
      reference: personalisation.referenceNumber
    })
  } catch (err) {
    console.error('Error sending confirmation email:', err)
    throw err
  }
} 