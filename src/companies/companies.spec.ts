import { PrismaService } from '../prisma-service/prisma-service.service';
import { CompaniesService } from './companies.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import * as passwordUtils from '../common/helpers/hash-password.helper';

describe('companiesService', () => {
  let companyService: CompaniesService;
  let prismaService: PrismaService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        { provide: PrismaService, useClass: PrismaService },

        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              switch (key) {
                case 'DATABASE_URL':
                  return 'postgresql://username:password@localhost:5432/nestjs_test';
                case 'JWT_SECRET':
                  return 'test-secret';
                default:
                  throw new Error(`No config found for key: ${key}`);
              }
            }),
          },
        },
      ],
    }).compile();

    companyService = module.get<CompaniesService>(CompaniesService);
    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);

    jest
      .spyOn(passwordUtils, 'hashPassword')
      .mockResolvedValue('hashedPassword');
  });

  describe('create', () => {
    const createCompany = {
      id: '123',
      name: 'Test Company',
      email: 'test@example.com',
      password: 'password',
      nit: '123456789',
      role: 'company',
    };
    const companyWhatever = {
      id: '123',
      name: 'Test Company',
      email: 'test@example.com',
      role: 'company',
      nit: '123456789',
      password: 'password',
      createdAt: null, // Asegúrate de incluir 'createdAt'
      updatedAt: null, // Asegúrate de incluir 'updatedAt'
      deletedAt: null,
    };
    it('should create a new company', async () => {
      jest
        .spyOn(prismaService.company, 'create')
        .mockResolvedValue(companyWhatever);
      const company = await companyService.create(createCompany);
      expect(company).toMatchObject({
        id: '123',
        name: 'Test Company',
        email: 'test@example.com',
        nit: '123456789',
        role: 'company',
      });
    });
  });
  describe('findOne', () => {
    it('should look for a company', async () => {
      jest.spyOn(prismaService.company, 'findUnique').mockResolvedValue({
        id: '123',
        name: 'Test Company',
        email: 'test@example.com',
        role: 'company',
        nit: '123456789',
        password: 'password',
        createdAt: null, // Asegúrate de incluir 'createdAt'
        updatedAt: null, // Asegúrate de incluir 'updatedAt'
        deletedAt: null,
      });
      const response = await companyService.findOne('123');
      expect(response).toMatchObject({
        id: '123',
        name: 'Test Company',
        email: 'test@example.com',
        role: 'company',
        nit: '123456789',
        password: 'password',
        createdAt: null, // Asegúrate de incluir 'createdAt'
        updatedAt: null, // Asegúrate de incluir 'updatedAt'
        deletedAt: null,
      });
    });

    it('should throw an error if the company does not exist', async () => {
        jest
         .spyOn(prismaService.company, 'findUnique')
         .mockRejectedValue(null);
        await expect(companyService.findOne('123')).rejects.toThrow(
          'An unexpected error occurred',
        );
    })

  });

  describe('findByEmail', () => {
    it('should return a company where is not deleted and with the same email provided', async () => {
        jest.spyOn(prismaService.company, 'findUnique').mockResolvedValue({
            id: '123',
            name: 'Test Company',
            email: 'test@example.com',
            role: 'company',
            nit: '123456789',
            password: 'password',
            createdAt: null, // Asegúrate de incluir 'createdAt'
            updatedAt: null, // Asegúrate de incluir 'updatedAt'
            deletedAt: null,
          });

          const company = await companyService.findByEmail('test@example.com');
          expect(company).toMatchObject({
            id: '123',
            name: 'Test Company',
            email: 'test@example.com',
            role: 'company',
            nit: '123456789',
            password: 'password',
            createdAt: null, // Asegúrate de incluir 'createdAt'
            updatedAt: null, // Asegúrate de incluir 'updatedAt'
            deletedAt: null,
          })
    });

})
describe('updatePassword', () => {
    
})
//keep the tests here

});
