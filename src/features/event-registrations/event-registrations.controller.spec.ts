import { Test, TestingModule } from '@nestjs/testing';
import { EventRegistrationsController } from './event-registrations.controller';
import { EventRegistrationsService } from './event-registrations.service';

describe('EventRegistrationsController', () => {
  let controller: EventRegistrationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventRegistrationsController],
      providers: [EventRegistrationsService],
    }).compile();

    controller = module.get<EventRegistrationsController>(EventRegistrationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
