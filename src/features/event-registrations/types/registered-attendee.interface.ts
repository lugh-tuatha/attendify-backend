export interface EventRegistration {
  id: string;
  eventId: string;
  attendeeId: string | null;
  firstName: string | null;
  lastName: string | null;
  invitedBby: string | null;
  primaryLeader: string | null;
  churchHierarchy: string | null;
  memberStatus: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LTHMIProfile {
  firstName: string;
  lastName: string;
  primaryLeader: string;
  churchHierarchy: string;
  memberStatus: string;
}