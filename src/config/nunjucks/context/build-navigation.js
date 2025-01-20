/**
 * @param {Partial<Request> | null} request
 */
export function buildNavigation(request) {
  return [
    {
      text: 'Home',
      url: '/',
      isActive: request?.path === '/'
    },
    {
      text: 'Search',
      url: '/applicant/search',
      isActive: request?.path === '/applicant/search'
    }
  ]
}

/**
 * @import { Request } from '@hapi/hapi'
 */
