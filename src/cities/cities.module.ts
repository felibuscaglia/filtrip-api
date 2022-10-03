import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from 'src/entities';
import { CitiesService } from './cities.service';
import { CityFactory } from './city.factory';

@Module({
  providers: [CitiesService, CityFactory],
  imports: [HttpModule, TypeOrmModule.forFeature([City])]
})
export class CitiesModule { }
