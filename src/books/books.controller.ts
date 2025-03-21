import { BadRequestException, Controller, Get } from '@nestjs/common';
import { BooksService } from './books.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Book } from './book.entity';

@ApiTags('Buku')
@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    @ApiOperation({ summary: 'Menampilkan semua data buku' })
    @ApiResponse({ status: 200, description: 'Daftar buku yang tersedia', type: [Book] })
    @Get('available')
    async findAllAvailableBooks() {
        try {
            return await this.booksService.findAvailable();
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
