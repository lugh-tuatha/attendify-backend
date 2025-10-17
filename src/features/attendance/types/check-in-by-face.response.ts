export interface CheckInByFaceResponse {
  "verified": boolean,
  "attendee_id": string | null,
  "first_name": string | null,
  "last_name": string | null,
  "distance": number | null,
  "message": string | null,
  "closest_match_distance": number | null,
}