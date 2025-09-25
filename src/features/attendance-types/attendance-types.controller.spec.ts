import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceTypesController } from './attendance-types.controller';
import { AttendanceTypesService } from './attendance-types.service';

describe('AttendanceTypesController', () => {
  let controller: AttendanceTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceTypesController],
      providers: [AttendanceTypesService],
    }).compile();

    controller = module.get<AttendanceTypesController>(AttendanceTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
