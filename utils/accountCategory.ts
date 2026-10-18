export type AccountCategory = 'Student' | 'Faculty' | 'Admin';

export const accountCategory = (role: string): AccountCategory => {
  const value = role.toLowerCase();
  if (value.includes('admin')) return 'Admin';
  if (value.includes('faculty') || value.includes('alumni')) return 'Faculty';
  return 'Student';
};

export const isAdminAccount = (role: string | undefined) => accountCategory(role ?? '') === 'Admin';
