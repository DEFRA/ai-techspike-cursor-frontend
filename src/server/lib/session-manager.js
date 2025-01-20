export class SessionManager {
  constructor(request) {
    this.request = request
  }

  get(path) {
    const sessionData = this.request.yar?.get('sessionData') || {}
    return path.split('.').reduce((obj, key) => obj?.[key] ?? '', sessionData)
  }

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
