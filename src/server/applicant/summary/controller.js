import { SessionManager } from '~/src/server/lib/session-manager.js'

const TASK_LIST = {
  personalDetails: {
    sectionTitle: 'Your details',
    tasks: [
      {
        id: 'name',
        title: 'Your name',
        path: '/applicant/name',
        sessionPath: 'applicant.name'
      },
      {
        id: 'email',
        title: 'Email address',
        path: '/applicant/email',
        sessionPath: 'applicant.email'
      }
    ]
  },
  businessDetails: {
    sectionTitle: 'Business details',
    tasks: [
      {
        id: 'businessName',
        title: 'Business name',
        path: '/applicant/business/name',
        sessionPath: 'applicant.business.name'
      },
      {
        id: 'businessAddress',
        title: 'Business address',
        path: '/applicant/business/address',
        sessionPath: 'applicant.business.address.addressLine1'
      }
    ]
  }
}

export const summaryController = {
  get: {
    handler: (request, h) => {
      const session = new SessionManager(request)
      const sessionData = session.getAll()

      session.set('applicant', {
        name: '',
        email: '',
        business: {
          name: '',
          address: {
            addressLine1: '',
            addressLine2: '',
            addressTown: '',
            addressCounty: '',
            addressPostcode: ''
          }
        },
        ...sessionData.applicant
      })

      // Process tasks and check completion
      const sections = Object.entries(TASK_LIST).map((section) => ({
        ...section,
        tasks: section.tasks.map((task) => ({
          ...task,
          isComplete: Boolean(session.get(task.sessionPath))
        }))
      }))

      // Check if all tasks are completed
      const isComplete = sections.every((section) =>
        section.tasks.every((task) => task.isComplete)
      )

      return h.view('applicant/summary/index', {
        pageTitle: 'Application summary',
        heading: 'Application summary',
        sections,
        isComplete
      })
    }
  }
}
