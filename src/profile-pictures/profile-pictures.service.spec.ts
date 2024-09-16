import { Test, TestingModule } from '@nestjs/testing';
import { ProfilePicturesService } from './profile-pictures.service';

describe('ProfilePicturesService', () => {
  let service: ProfilePicturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfilePicturesService],
    }).compile();

    service = module.get<ProfilePicturesService>(ProfilePicturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
