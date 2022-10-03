import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';

@Module({
  providers: [CitiesService],
  imports: [HttpModule]
})
export class CitiesModule {}
