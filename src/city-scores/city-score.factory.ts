import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { CityScoreDto, IUnformattedCityScore } from './interfaces';

@Injectable()
export class CityScoreFactory {
  constructor() {}

  public async format({
    name,
    score,
    city,
  }: IUnformattedCityScore): Promise<CityScoreDto> {
    const FORMATTED_CITY_SCORE: CityScoreDto = {
      name,
      score,
      city,
    };

    const errors = await validate(FORMATTED_CITY_SCORE);

    if (errors.length) {
      throw new Error('City score could not be formatted properly');
    }

    return FORMATTED_CITY_SCORE;
  }
}
