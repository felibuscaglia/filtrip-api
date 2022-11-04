import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City, CityScore } from 'src/entities';
import { Repository } from 'typeorm';
import { CityScoreFactory } from './city-score.factory';
import { ITeleportScoresDTO } from './interfaces';

@Injectable()
export class CityScoresService {
  constructor(
    private readonly httpService: HttpService,
    private readonly cityScoreFactory: CityScoreFactory,
    @InjectRepository(CityScore) private readonly cityScoresRepository: Repository<CityScore>
  ) {}

  private readonly logger = new Logger('CityScoresService');

  public async getCityScoresJob(city: City, href: string) {
    try {
      const { data: CITY_SCORES_DTO } =
        await this.httpService.axiosRef.get<ITeleportScoresDTO>(href);

      for (const SCORE of CITY_SCORES_DTO.categories) {
        const FORMATTED_CITY_SCORE = await this.cityScoreFactory.format({
          name: SCORE.name,
          score: Math.round(SCORE.score_out_of_10),
          city,
        });

        await this.cityScoresRepository.save(FORMATTED_CITY_SCORE);
      }
    } catch (err) {
      this.logger.error('Could not get city scores from ' + city.name);
      this.logger.error(JSON.stringify(err));
    }
  }
}
