import { BadRequestException, Controller, Get } from '@nestjs/common';
import { MembersService } from './members.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Member } from './member.entity';

@ApiTags('Anggota')
@Controller('members')
export class MembersController {
    constructor(
        private readonly MembersService: MembersService
    ) {}

    @ApiOperation({ summary: 'Menampilkan semua data anggota' })
    @ApiResponse({ status: 200, description: 'Daftar anggota yang terdaftar', type: [Member] })
    @Get()
    async findAll() {
        try {
            return await this.MembersService.findAll();
        } catch (error) {
            return new BadRequestException(error.message);
        }
    }
}
