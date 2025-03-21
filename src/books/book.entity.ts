import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'JK-45', description: 'Kode unik buku' })
    @Column({ unique: true })
    code: string;

    @ApiProperty({ example: 'Harry Potter', description: 'Judul buku' })
    @Column()
    title: string;

    @ApiProperty({ example: 'J.K. Rowling', description: 'Penulis buku' })
    @Column()
    author: string;

    @ApiProperty({ example: 1, description: 'Jumlah buku tersedia' })
    @Column({ default: 1 })
    stock: number;
}