import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceTypesService } from './attendance-types.service';

describe('AttendanceTypesService', () => {
  let service: AttendanceTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendanceTypesService],
    }).compile();

    service = module.get<AttendanceTypesService>(AttendanceTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
