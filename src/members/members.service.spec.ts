import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from './members.service';
import { Repository } from 'typeorm';
import { Member } from './member.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('MembersService', () => {
  let service: MembersService;
  let membersRepository: Repository<Member>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: getRepositoryToken(Member),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
    membersRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
  });

  // Test case untuk method findAll
  describe('findAll', () => {
    it('harus mengembalikan semua data member', async () => {
      const mockMembers: Member[] = [
        { code: 'M001', name: 'Member 1'} as Member,
        { code: 'M002', name: 'Member 2'} as Member,
      ];

      jest.spyOn(membersRepository, 'find').mockResolvedValue(mockMembers);

      const members = await service.findAll();
      expect(members).toEqual(mockMembers);
    });
  });

  // Test case untuk method findOne
  describe('findOne', () => {
    it('harus mengembalikan member berdasarkan kode member', async () => {
      const mockMember: Member = { code: 'M001', name: 'Member 1'} as Member;

      jest.spyOn(membersRepository, 'findOne').mockResolvedValue(mockMember);

      const member = await service.findOne('M001');
      expect(member).toEqual(mockMember);
    });
    it('harus mengembalikan nilai null jika member tidak ditemukan', async () => {
      jest.spyOn(membersRepository, 'findOne').mockResolvedValue(null);

      const foundMember = await service.findOne('INVALID-CODE');
      expect(foundMember).toBeNull();
    });
  });
});
