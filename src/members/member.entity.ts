import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Member {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'M001', description: 'Kode unik member' })
    @Column({ unique: true })
    code: string;

    @ApiProperty({ example: 'Angga', description: 'Nama member' })
    @Column()
    name: string;
}