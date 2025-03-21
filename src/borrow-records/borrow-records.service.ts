import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BorrowRecord } from './borrow-record.entity';
import { IsNull, Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import { BooksService } from '../books/books.service';
import { MembersService } from '../members/members.service';

@Injectable()
export class BorrowRecordsService {
    constructor(
        @InjectRepository(BorrowRecord)
        private readonly borrowRecordRepository: Repository<BorrowRecord>,
        private readonly booksService: BooksService,
        private readonly membersService: MembersService
    ) {}

    /* -------------------------------------------------------------------------- */
    /*                       Jumlah pinjaman buku per member                      */
    /* -------------------------------------------------------------------------- */
    async getBorrowedBooks(): Promise<any[]> {
        // Ambil semua data peminjaman (yang belum dikembalikan)
        const borrowedRecord =  await this.borrowRecordRepository.find({
            relations: ['member'],
            where: { returnedAt: IsNull() }
        });

        // Ambil semua data member
        const members = await this.membersService.findAll();

        // Hitung jumlah buku yang dipinjam oleh setiap member
        const borrowedBooks = members.map(member => {
            const borrowed = borrowedRecord.filter(record => record.member.code === member.code);
            return { member, borrowed: borrowed.length };
        });
        
        return borrowedBooks;
    }

    /* -------------------------------------------------------------------------- */
    /*                                 Pinjam buku                                */
    /* -------------------------------------------------------------------------- */
    async BorrowBook(memberCode: string, bookdCode: string): Promise<BorrowRecord> {
        const member = await this.membersService.findOne(memberCode);
        if (!member) {
            throw new BadRequestException('Member tidak ditemukan!');
        }

        // Periksa apakah member terkana penalti
        const latestReturn = await this.borrowRecordRepository.findOne({
            where: { member, isPenalized: true },
            order: { returnedAt: 'DESC' }
        });
        // Periksa apakah waktu penalti sudah berakhir
        if (latestReturn) {
            if (dayjs(latestReturn.returnedAt).add(3, 'day').isAfter(Date.now())) {
                throw new BadRequestException('Member masih terkena penalti dan tidak bisa meminjam buku selama 3 hari semenjak pengembalian buku!');
            }
        }

        // Perisa apakah member sudah meminjam total 2 buku
        const activeBorrows = await this.borrowRecordRepository.find({
            where: { member, returnedAt: IsNull() }
        });
        if (activeBorrows.length >= 2) {
            throw new BadRequestException('Member tidak bisa meminjam lebih dari 2 buku!');
        }

        // Periksa apakah buku tersedia
        const book = await this.booksService.findOne(bookdCode);
        if (!book || book.stock < 1) {
            throw new BadRequestException('Buku tidak ditemukan!');
        }

        // Membuat record peminjaman
        const borrowRecord = this.borrowRecordRepository.create({
            member, 
            book, 
            borrowedAt: new Date()
        });
        await this.borrowRecordRepository.save(borrowRecord);

        // Update stok buku
        book.stock -= 1;
        await this.booksService.updateStock(book.code, book.stock);

        return borrowRecord;
    }

    /* -------------------------------------------------------------------------- */
    /*                              Pengembalian buku                             */
    /* -------------------------------------------------------------------------- */
    async ReturnBook(memberCode: string, bookCode: string): Promise<BorrowRecord> {
        const member = await this.membersService.findOne(memberCode);
        if (!member) {
            throw new BadRequestException('Member tidak ditemukan!');
        }

        // Periksa apakah buku merupakan yang dipinjam oleh member
        const borrowRecord  = await this.borrowRecordRepository.findOne({
            where: { member, book: { code: bookCode }, returnedAt: IsNull() },
            relations: ['book']
        });
        if (!borrowRecord) {
            throw new BadRequestException('Buku ini tidak dipinjam oleh member!');
        }

        // Periksa apakah pengembalian terlambat (lebih dari 7 hari)
        const borrowedAt = dayjs(borrowRecord.borrowedAt);
        const today = dayjs();
        const isLate = today.diff(borrowedAt, 'day') > 7;

        // Update waktu pengembalian dan isi status penalti
        borrowRecord.returnedAt = today.toDate();
        borrowRecord.isPenalized = isLate;
        await this.borrowRecordRepository.save(borrowRecord);

        // Update stok buku
        const book = borrowRecord.book;
        book.stock += 1;
        await this.booksService.updateStock(bookCode, book.stock);

        return borrowRecord;
    }
}
