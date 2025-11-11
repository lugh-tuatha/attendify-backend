import { MemberStatus } from '@prisma/client';

export const VIP_STATUSES: MemberStatus[] = [
  'FIRST_TIMER',
  'SECOND_TIMER',
  'THIRD_TIMER',
  'FOURTH_TIMER',
];

export const ATTENDEE_STATUSES: MemberStatus[] = [
  'REGULAR_ATTENDEE',
  'REGULAR_DISCIPLE',
  'REGULAR_STARTUP',
  'BACK_TO_LIFE',
  'CHILDREN',
];
