import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
    ) {}

    async findAvailable(): Promise<Book[]> {
        return this.bookRepository.find({ where: { stock: MoreThan(0) } });
    }

    async findOne(code: string): Promise<Book | null> {
        return this.bookRepository.findOne({ where: { code } });
    }

    async updateStock(bookCode: string, stock: number): Promise<Book> {
        const book = await this.findOne(bookCode);
        if (!book) {
            throw new Error('Buku tidak ditemukan!');
        }
        book.stock = stock;
        return this.bookRepository.save(book);
    }
}
