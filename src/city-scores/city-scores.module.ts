import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityScore } from 'src/entities';
import { CityScoreFactory } from './city-score.factory';
import { CityScoresService } from './city-scores.service';

@Module({
  providers: [CityScoresService, CityScoreFactory],
  exports: [CityScoresService],
  imports: [HttpModule, TypeOrmModule.forFeature([CityScore])]
})
export class CityScoresModule {}
