import { Test, TestingModule } from '@nestjs/testing';
import { BorrowRecordsService } from './borrow-records.service';
import { IsNull, Repository } from 'typeorm';
import { BorrowRecord } from './borrow-record.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../members/member.entity';
import { Book } from '../books/book.entity';
import { MembersService } from '../members/members.service';
import { BooksService } from '../books/books.service';
import * as dayjs from 'dayjs';
import { mock } from 'node:test';

const mockBorrowedRecords: BorrowRecord[] = [
  { member: { code: 'M-002' } as Member, returnedAt: new Date('2025-03-11 15:28:26.765') } as BorrowRecord,
  { member: { code: 'M-001' } as Member, returnedAt: new Date('2025-03-11 15:28:26.765') } as BorrowRecord,
];

const mockMembers: Member[] = [
  { code: 'M-001', name: 'Angga' } as Member,
  { code: 'M-002', name: 'Ferry' } as Member,
];

const mockBooks: Book[] = [
  { code: 'JK-45', title: 'Harry Potter', author: 'J.K. Rowling', stock: 1 } as Book,
  { code: 'SHR-1', title: 'A Study in Scarlet', author: 'Arthur Conan Doyle', stock: 1 } as Book,
];

describe('BorrowRecordsService', () => {
  let borrowRecordsService: BorrowRecordsService;
  let borrowRecordsRepository: Repository<BorrowRecord>;
  let membersService: MembersService;
  let booksService: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BorrowRecordsService,
        {
          provide: getRepositoryToken(BorrowRecord),
          useValue: {
            find: jest.fn().mockResolvedValue(mockBorrowedRecords),
            findOne: jest.fn().mockResolvedValue(mockBorrowedRecords[0]),
            create: jest.fn().mockReturnValue(mockBorrowedRecords[0]),
            save: jest.fn().mockResolvedValue(mockBorrowedRecords[0]),
          },
        },
        {
          provide: BooksService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockBooks),
            findOne: jest.fn().mockResolvedValue(mockBooks[0]),
            updateStock: jest.fn().mockResolvedValue(mockBooks[0]),
          }
        },
        {
          provide: MembersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockMembers),
            findOne: jest.fn().mockResolvedValue(mockMembers[0]),
          }
        }
      ],
    }).compile();

    borrowRecordsService = module.get<BorrowRecordsService>(BorrowRecordsService);
    membersService = module.get<MembersService>(MembersService);
    borrowRecordsRepository = module.get<Repository<BorrowRecord>>(getRepositoryToken(BorrowRecord));
    booksService = module.get<BooksService>(BooksService);
  });

  // Test case untuk method getBorrowedBooks
  describe('getBorrowedBooks', () => {
    it('harus mengembalikan jumlah buku yang dipinjam oleh setiap member', async () => {

      jest.spyOn(borrowRecordsRepository, 'find').mockResolvedValue(mockBorrowedRecords);
      jest.spyOn(membersService, 'findAll').mockResolvedValue(mockMembers);

      const borrowedBooks = await borrowRecordsService.getBorrowedBooks();
      expect(borrowedBooks[0]).toEqual(
        { member: expect.objectContaining(mockMembers[0]), borrowed: expect.any(Number) },
      );
    });
  });

  // Test case untuk method BorrowBook
  describe('BorrowBook', () => {
    it('harus melempar error jika member tidak ditemukan', async () => {
      jest.spyOn(membersService, 'findOne').mockResolvedValue(null);
  
      await expect(borrowRecordsService.BorrowBook('xxxx', 'JK-45')).rejects.toThrow('Member tidak ditemukan!');
    });
    it('harus melempar error jika member masih dalam penalti', async () => {
      const penaltyRecord = mockBorrowedRecords[0];
      penaltyRecord.isPenalized = true;
      penaltyRecord.returnedAt = dayjs().subtract(1, 'day').toDate();
  
      jest.spyOn(borrowRecordsRepository, 'findOne').mockResolvedValue(penaltyRecord);
  
      await expect(borrowRecordsService.BorrowBook('M001', 'JK-45')).rejects.toThrow(
        'Member masih terkena penalti dan tidak bisa meminjam buku selama 3 hari semenjak pengembalian buku!',
      );
    });
    it('harus melempar error jika member sudah meminjma 2 buku', async () => {
      const mockBorrows = [new BorrowRecord(), new BorrowRecord()];
  
      jest.spyOn(borrowRecordsRepository, 'find').mockResolvedValue(mockBorrows);
  
      await expect(borrowRecordsService.BorrowBook('M001', 'JK-45')).rejects.toThrow(
        'Member tidak bisa meminjam lebih dari 2 buku!',
      );
    });
    it('harus melempar error jika buku tidak tersedia', async () => {
      const mockBook = mockBooks[0];
      mockBook.stock = 0;
  
      jest.spyOn(booksService, 'findOne').mockResolvedValue(mockBook);
  
      await expect(borrowRecordsService.BorrowBook('M001', 'xxxx')).rejects.toThrow('Buku tidak ditemukan!');
    });
    it('harus berhasil meminjam buku', async () => {
      const mockMember = mockMembers[0];
      const mockBook = mockBooks[0];
      const mockBorrowRecord = { member: mockMember, book: mockBook, borrowedAt: new Date() } as BorrowRecord;
  
      jest.spyOn(membersService, 'findOne').mockResolvedValue(mockMember);
      jest.spyOn(borrowRecordsRepository, 'find').mockResolvedValue([]);
      jest.spyOn(booksService, 'findOne').mockResolvedValue(mockBook);
      jest.spyOn(borrowRecordsRepository, 'create').mockReturnValue(mockBorrowRecord as BorrowRecord);
      jest.spyOn(borrowRecordsRepository, 'save').mockResolvedValue(mockBorrowRecord);
      jest.spyOn(booksService, 'updateStock').mockResolvedValue(mockBook);
  
      const result = await borrowRecordsService.BorrowBook('M001', 'JK-45');
      expect(result).toEqual(mockBorrowRecord);
    });
  });

  // Test case untuk method ReturnBook
  describe('ReturnBook', () => {
    it('harus melempar error jika member tidak ditemukan', async () => {
      jest.spyOn(membersService, 'findOne').mockResolvedValue(null);
  
      await expect(borrowRecordsService.ReturnBook('xxxx', 'JK-45')).rejects.toThrow('Member tidak ditemukan!');
    });
    it('harus melempar error jika buku tidak ditemukan', async () => {
      jest.spyOn(booksService, 'findOne').mockResolvedValue(null);
  
      await expect(borrowRecordsService.ReturnBook('M001', 'xxxx')).rejects.toThrow('Buku tidak ditemukan!');
    });
    it('harus berhasil mengembalikan buku', async () => {
      const mockMember = mockMembers[0];
      const mockBook = mockBooks[0];
      const mockBorrowRecord = { member: mockMember, book: mockBook, borrowedAt: new Date() } as BorrowRecord;
  
      jest.spyOn(membersService, 'findOne').mockResolvedValue(mockMember);
      jest.spyOn(booksService, 'findOne').mockResolvedValue(mockBook);
      jest.spyOn(borrowRecordsRepository, 'findOne').mockResolvedValue(mockBorrowRecord);
      jest.spyOn(borrowRecordsRepository, 'save').mockResolvedValue(mockBorrowRecord);
      jest.spyOn(booksService, 'updateStock').mockResolvedValue(mockBook);
  
      const result = await borrowRecordsService.ReturnBook('M001', 'JK-45');
      expect(result).toEqual(mockBorrowRecord);
    });
  });
});
