import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from 'src/entities';
import { CountriesService } from './countries.service';
import { CountryFactory } from './country.factory';

@Module({
  providers: [CountriesService, CountryFactory],
  imports: [HttpModule, TypeOrmModule.forFeature([Country])],
  exports: [CountriesService]
})
export class CountriesModule {}
