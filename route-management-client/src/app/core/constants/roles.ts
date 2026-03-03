export const Roles = {
  Admin: 'Admin',
  TourOperatorMember: 'TourOperatorMember',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];