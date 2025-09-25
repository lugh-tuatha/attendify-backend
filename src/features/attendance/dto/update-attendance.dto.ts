import { PartialType } from '@nestjs/swagger';
import { CreateAttendanceDTO } from './create-attendance.dto';

export class updateAttendanceDTO extends PartialType(CreateAttendanceDTO) {}