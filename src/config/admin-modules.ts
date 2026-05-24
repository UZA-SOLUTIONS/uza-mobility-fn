export const adminModulePages: Record<
  string,
  { title: string; description: string }
> = {
  orders: {
    title: 'Orders',
    description: 'Track orders and update fulfillment status.',
  },
  payments: {
    title: 'Payments',
    description: 'Verify, reject, or refund buyer payments.',
  },
  invoices: {
    title: 'Invoices',
    description: 'Send and cancel invoices.',
  },
  financing: {
    title: 'Financing',
    description: 'Review financing requests and bank assignments.',
  },
  fleet: {
    title: 'Fleet',
    description: 'Manage fleet requests and status updates.',
  },
  promotions: {
    title: 'Promotions',
    description: 'Create campaigns and attach listings.',
  },
  sustainability: {
    title: 'Sustainability',
    description: 'View impact metrics and manage emission factors.',
  },
  users: {
    title: 'Users',
    description: 'Assign roles and deactivate accounts.',
  },
};
