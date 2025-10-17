import { PartialType } from '@nestjs/swagger';
import { CreateAttendanceDTO } from './create-attendance.dto';

export class UpdateAttendanceDTO extends PartialType(CreateAttendanceDTO) {}