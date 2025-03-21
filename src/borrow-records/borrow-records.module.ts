import { Module } from '@nestjs/common';
import { BorrowRecordsService } from './borrow-records.service';
import { BorrowRecordsController } from './borrow-records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowRecord } from './borrow-record.entity';
import { BooksModule } from '../books/books.module';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BorrowRecord]),
    BooksModule,
    MembersModule
  ],
  providers: [BorrowRecordsService],
  controllers: [BorrowRecordsController],
  exports: [BorrowRecordsService]
})
export class BorrowRecordsModule {}
