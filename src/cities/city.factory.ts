import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { formatUrlSlug } from 'src/lib/helpers';
import { CityDto, IUnformattedCity } from './interfaces';

@Injectable()
export class CityFactory {
  constructor() { }

  public async format({ name }: IUnformattedCity): Promise<CityDto> {
    const FORMATTED_CITY: CityDto = {
      name,
      urlSlug: formatUrlSlug(name),
    };

    const errors = await validate(FORMATTED_CITY);

    if (errors.length) {
      throw new Error('City ' + name + 'could not be formatted properly');
    }

    return FORMATTED_CITY;
  }
}