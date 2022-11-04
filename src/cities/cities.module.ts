import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from 'src/entities';
import { PhotosModule } from 'src/photos/photos.module';
import { CitiesService } from './cities.service';
import { CityFactory } from './city.factory';
import { CitiesController } from './cities.controller';
import { CountriesModule } from 'src/countries/countries.module';
import { CityScoresModule } from 'src/city-scores/city-scores.module';

@Module({
  providers: [CitiesService, CityFactory],
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([City]),
    PhotosModule,
    CountriesModule,
    CityScoresModule
  ],
  controllers: [CitiesController],
  exports: [CitiesService],
})
export class CitiesModule {}
