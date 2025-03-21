import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "../members/member.entity";
import { Book } from "../books/book.entity";

@Entity()
export class BorrowRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: '1', description: 'Id data member peminjaman' })
    @ManyToOne(() => Member)
    member: Member;

    @ApiProperty({ example: '1', description: 'Id data buku peminjaman' })
    @ManyToOne(() => Book)
    book: Book;

    @ApiProperty({ example: '2025-03-01', description: 'Tanggal peminjaman' })
    @CreateDateColumn()
    borrowedAt: Date;

    @ApiProperty({ example: '2025-03-08', description: 'Tanggal pengembalian' })
    @Column({ nullable: true })
    returnedAt: Date;

    @ApiProperty({ example: false, description: 'Status Penalti' })
    @Column({ default: false })
    isPenalized: boolean;
}