import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from 'src/entities';
import { PhotosService } from './photos.service';

@Module({
  providers: [PhotosService],
  exports: [PhotosService],
  imports: [TypeOrmModule.forFeature([Photo])]
})
export class PhotosModule { }
