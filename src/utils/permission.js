export function canAccessUsers(permissions) {
  return permissions.some(p =>
    ['users.read', 'users.create', 'users.update', 'users.delete'].includes(p)
  );
}

export function canAccessRoles(permissions) {
  return permissions.some(p =>
    ['roles.manage', 'roles.update', 'roles.delete'].includes(p)
  );
}

export function canAccessPermissions(permissions) {
  return permissions.includes('permissions.manage');
}

export function canAccessProfile(permissions) {
  return permissions.includes('self.read');
}
