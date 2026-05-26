export const adminModulePages: Record<
  string,
  { title: string; description: string }
> = {
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
