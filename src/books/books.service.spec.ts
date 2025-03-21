import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('BooksService', () => {
  let service: BooksService;
  let booksRepository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService, 
        {
          provide: getRepositoryToken(Book),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    booksRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  // Test case untuk method findAvailable
  describe('findAvailable', () => {
    it('harus mengembalikan buku yang tersedia (tidak termasuk buku yang dipinjam)', async () => {
      const mockBooks: Book[] = [
        { code: 'JK-45', title: 'Harry Potter', author: 'J.K. Rowling', stock: 1 } as Book,
        { code: 'SHR-1', title: 'A Study in Scarlet', author: 'Arthur Conan Doyle', stock: 1 } as Book,
      ];
      
      jest.spyOn(booksRepository, 'find').mockResolvedValue(mockBooks);

      const availableBooks  = await service.findAvailable();
      expect(availableBooks ).toEqual(mockBooks);
    });
  });

  // Test case untuk method findOne
  describe('findOne', () => {
    it('harus mengembalikan buku berdasarkan kode buku', async () => {
      const mockBook: Book = { code: 'JK-45', title: 'Harry Potter', author: 'J.K. Rowling', stock: 1 } as Book;
      
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(mockBook);

      const book = await service.findOne('JK-45');
      expect(book).toEqual(mockBook);
    });
    it('harus mengembalikan nilai null jika buku tidak ditemukan', async () => {
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(null);
  
      const foundBook = await service.findOne('INVALID-CODE');
      expect(foundBook).toBeNull();
    });
  });

  // Test case untuk method updateStock
  describe('updateStock', () => {
    it('harus mengembalikan buku yang telah diupdate', async () => {
      const mockBook: Book = { code: 'JK-45', title: 'Harry Potter', author: 'J.K. Rowling', stock: 1 } as Book;
      
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(mockBook);
      jest.spyOn(booksRepository, 'save').mockResolvedValue(mockBook);

      const updatedBook = await service.updateStock('JK-45', 1);
      expect(updatedBook).toEqual(mockBook);
    });
    it('harus melemparkan error jika buku tidak ditemukan', async () => {
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(null);

      await expect(service.updateStock('INVALID-CODE', 1)).rejects.toThrowError('Buku tidak ditemukan!');
    });
  });
});
