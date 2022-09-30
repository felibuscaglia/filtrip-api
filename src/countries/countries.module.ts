import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';

@Module({
  providers: [CountriesService]
})
export class CountriesModule {}
