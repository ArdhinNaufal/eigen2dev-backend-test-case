import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { MembersModule } from './members/members.module';
import { BorrowRecordsModule } from './borrow-records/borrow-records.module';
import { SeedService } from './seed/seed.service';
import { Book } from './books/book.entity';
import { Member } from './members/member.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ // Load .env file
      isGlobal: true, // Membuat variabel env tersedia secara global di setiap modul
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true, // Auto-load entities
        synchronize: true, // Auto-sync database schema (disable in production)
      })
    }),
    BooksModule,
    MembersModule,
    BorrowRecordsModule,
    TypeOrmModule.forFeature([Book, Member]),
  ],
  providers: [SeedService],
})
export class AppModule {}
