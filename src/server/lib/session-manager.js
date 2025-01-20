/**
 * @typedef {Object} BusinessAddress
 * @property {string} addressLine1
 * @property {string} addressLine2
 * @property {string} addressTown
 * @property {string} addressCounty
 * @property {string} addressPostcode
 */

/**
 * @typedef {Object} Business
 * @property {BusinessAddress} address
 */

/**
 * @typedef {Object} Applicant
 * @property {string} name
 * @property {string} email
 * @property {Business} business
 */

/**
 * @typedef {Object} SessionData
 * @property {Applicant} applicant
 */

export class SessionManager {
  constructor(request) {
    this.request = request
  }

  /**
   * Gets a value from the session using dot notation path
   * @param {string} path - Dot notation path e.g. 'applicant.name'
   * @returns {any} Value from session or empty string if not found
   */
  get(path) {
    const sessionData = this.request.yar?.get('sessionData') || {}
    return path.split('.').reduce((obj, key) => (obj?.[key] ?? ''), sessionData)
  }

  /**
   * Sets a value in the session using dot notation path
   * @param {string} path - Dot notation path e.g. 'applicant.name'
   * @param {any} value - Value to set
   */
  set(path, value) {
    const sessionData = this.request.yar?.get('sessionData') || {}
    const keys = path.split('.')
    const lastKey = keys.pop()
    const target = keys.reduce((obj, key) => {
      obj[key] = obj[key] || {}
      return obj[key]
    }, sessionData)
    target[lastKey] = value
    this.request.yar.set('sessionData', sessionData)
  }

  /**
   * Gets all session data
   * @returns {SessionData} Complete session data object
   */
  getAll() {
    return this.request.yar?.get('sessionData') || {}
  }
} 