import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendeesModule } from './features/attendees/attendees.module';
import { OrganizationsModule } from './features/organizations/organizations.module';

@Module({
  imports: [AttendeesModule, OrganizationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
