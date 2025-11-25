import { ChurchProcess, MemberStatus } from '@prisma/client';

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

export const CHURCH_PROCESSES: ChurchProcess[] = [
  'PENDING',
  'START_UP_LESSON',
  'PRE_ENCOUNTER',
  'POST_ENCOUNTER',
  'SOL_1',
  'SOL_2',
  'SOL_3',
  'UNDERCOVER',
  'PASTORAL_MINISTRY',
];