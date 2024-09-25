import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma-service/prisma-service.service';
import { ProfilePictureService } from './profile-pictures.service';

describe('profilePicturesService', () => {
  let profilePictureService: ProfilePictureService;
  let prismaService: PrismaService;

  const response = {
    id: '123',
    imageUrl: 'https://example.com/image.jpg',
    collaboratorId: '123',
    companyId: '456',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProfilePictureService,
        {
          provide: PrismaService,
          useValue: {
            profilePicture: {
              create: jest.fn().mockResolvedValue(response),
              findUnique: jest.fn().mockResolvedValue(response),
              update: jest.fn().mockResolvedValue(response),
              deleteMany: jest.fn()
            },
          },
        },
      ],
    }).compile();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
    profilePictureService = moduleRef.get<ProfilePictureService>(ProfilePictureService);
  });

  describe('uploadProfilePicture', () => {
    it('should throw an error if collabotorId or companyId is not being provided', async () => {
      const data = {
        imageUrl: 'https://example.com/image.jpg',
      };
      await expect(() =>
        profilePictureService.uploadProfilePicture(data),
      ).rejects.toThrow('You must provide either collaboratorId or companyId.');
    });

    it('should return a profilePicture object', async () => {
      const data = {
        imageUrl: 'https://example.com/image.jpg',
        collaboratorId: '123',
        companyId: '456',
      };

      //   jest.spyOn(prismaService.profilePicture, 'create').mockResolvedValue(response);
      const profilePicture =
        await profilePictureService.uploadProfilePicture(data);
      expect(profilePicture).toBe(response);
    });
  });

  describe('getProfilePicture', () => {
    it('should return a profile picture object', async () => {
      const responseDatabase =
        await profilePictureService.getProfilePicture('123');

      expect(responseDatabase).toBe(response);
    });
  });

  describe('updateProfilePicture', () => {
    it('should update a profile picture', async () => {
        const responseUpdate = await profilePictureService.updateProfilePicture('123', 'imaginary.url');
        expect(responseUpdate).toBe(response)
    });
    describe('deleteProfilePicture', () => {
        it('should delete the profile picture and return a count object with a value of 1', async () => {

            jest.spyOn(prismaService.profilePicture, 'deleteMany').mockResolvedValue({count:1});


            const test = await profilePictureService.deleteProfilePicture('123')
            console.log(test)
            expect({count:1}).toEqual(test);
        })
    });
  });
});
