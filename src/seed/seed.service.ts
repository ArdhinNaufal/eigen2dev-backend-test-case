import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/books/book.entity';
import { Member } from 'src/members/member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService implements OnModuleInit {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
        @InjectRepository(Member)
        private readonly memberRepository: Repository<Member>
    ) {}

    private async seedDatabase() {
        const bookCount = await this.bookRepository.count();
        if (bookCount > 0) return;  // Lewati jika sudah ada data di database

        const books = [
            {
                code: "JK-45",
                title: "Harry Potter",
                author: "J.K Rowling",
                stock: 1
            },
            {
                code: "SHR-1",
                title: "A Study in Scarlet",
                author: "Arthur Conan Doyle",
                stock: 1
            },
            {
                code: "TW-11",
                title: "Twilight",
                author: "Stephenie Meyer",
                stock: 1
            },
            {
                code: "HOB-83",
                title: "The Hobbit, or There and Back Again",
                author: "J.R.R. Tolkien",
                stock: 1
            },
            {
                code: "NRN-7",
                title: "The Lion, the Witch and the Wardrobe",
                author: "C.S. Lewis",
                stock: 1
            },
        ];

        const members = [
            {
                code: "M001",
                name: "Angga",
            },
            {
                code: "M002",
                name: "Ferry",
            },
            {
                code: "M003",
                name: "Putri",
            },
        ];

        await this.bookRepository.save(books);
        await this.memberRepository.save(members);

        console.log('✅ Database seeded successfully!');
    }

    async onModuleInit() {
        await this.seedDatabase();
    }
}
