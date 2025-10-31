import { Attendance } from "@prisma/client";
import { FaceRecognitionApiResponse } from "./face-recognition-api.response";

export interface CheckInByFaceResponse {
  message: string;
  attendanceRecord?: Attendance;
  recognitionData: FaceRecognitionApiResponse;
}