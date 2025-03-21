import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book])], // Mendafarkan entity Book
  providers: [BooksService],
  controllers: [BooksController],
  exports: [BooksService]
})
export class BooksModule {}
