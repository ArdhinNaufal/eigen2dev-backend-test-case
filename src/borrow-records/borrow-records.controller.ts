import { BadRequestException, Body, Controller, Get, Post, Req } from '@nestjs/common';
import { BorrowRecordsService } from './borrow-records.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BorrowRecord } from './borrow-record.entity';

@ApiTags('Peminjaman Buku')
@Controller('borrow-records')
export class BorrowRecordsController {
    constructor(
        private readonly borrowRecordsService: BorrowRecordsService
    ) {}

    /* -------------------------------------------------------------------------- */
    /*                           Peminjaman buku member                           */
    /* -------------------------------------------------------------------------- */
    @ApiOperation({ summary: 'Menampilkan semua data peminjaman buku setiap member' })
    @ApiResponse({ status: 200, description: 'Daftar peminjaman buku setiap member' })
    @Get('members')
    async borrowedBooks() {
        try {
            return await this.borrowRecordsService.getBorrowedBooks();
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                                 Pinjam buku                                */
    /* -------------------------------------------------------------------------- */
    @ApiOperation({ summary: 'Meminjam buku' })
    @ApiResponse({ status: 201, description: 'Buku berhasil dipinjam', type: [BorrowRecord] })
    @ApiBody({ schema: { example: { memberCode: 'string', bookCode: 'string' } } })
    @Post()
    async borrowBook(@Body('memberCode') memberCode: string, @Body('bookCode') bookCode: string) {
        try {
            return await this.borrowRecordsService.BorrowBook(memberCode, bookCode);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /* -------------------------------------------------------------------------- */
    /*                              Pengembalian buku                             */
    /* -------------------------------------------------------------------------- */
    @ApiOperation({ summary: 'Mengembalikan buku' })
    @ApiResponse({ status: 201, description: 'Buku berhasil dikembalikan', type: [BorrowRecord] })
    @ApiBody({ schema: { example: { memberCode: 'string', bookCode: 'string' } } })
    @Post('return')
    async returnBook(@Body('memberCode') memberCode: string, @Body('bookCode') bookCode: string) {
        try {
            return await this.borrowRecordsService.ReturnBook(memberCode, bookCode);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
