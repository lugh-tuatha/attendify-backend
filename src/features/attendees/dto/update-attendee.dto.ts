import { PartialType } from '@nestjs/swagger';
import { CreateAttendeeDTO } from './create-attendee.dto';

export class UpdateAttendeeDTO extends PartialType(CreateAttendeeDTO) {}