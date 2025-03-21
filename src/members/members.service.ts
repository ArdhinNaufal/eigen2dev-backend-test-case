import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MembersService {
    constructor(
        @InjectRepository(Member)
        private readonly memberRepository: Repository<Member>
    ) {}

    async findAll(): Promise<Member[]> {
        return await this.memberRepository.find();
    }

    async findOne(code: string): Promise<Member | null> {
        return this.memberRepository.findOne({ where: { code } });
    }
}
