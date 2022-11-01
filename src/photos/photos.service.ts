import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from 'src/entities';
import { Repository } from 'typeorm';
import { ImageDto } from './interfaces';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly photosRepository: Repository<Photo>,
  ) {}

  save(imageDto: ImageDto) {
    return this.photosRepository.save(imageDto);
  }

  async upsert(imageDto: ImageDto) {
    await this.photosRepository
      .createQueryBuilder()
      .insert()
      .into(Photo)
      .values(imageDto)
      .orIgnore(true)
      .execute();
  }
}
