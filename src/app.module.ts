import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendeesModule } from './features/attendees/attendees.module';
import { OrganizationsModule } from './features/organizations/organizations.module';
import { AttendanceModule } from './features/attendance/attendance.module';
import { EventsModule } from './features/events/events.module';
import { EventRegistrationsModule } from './features/event-registrations/event-registrations.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AttendeesModule, 
    OrganizationsModule, 
    AttendanceModule, 
    EventsModule, 
    EventRegistrationsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
