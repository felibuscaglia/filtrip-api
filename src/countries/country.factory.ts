import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { formatUrlSlug } from 'src/lib/helpers';
import { CountryDto, IUnformattedCountry } from './interfaces';

@Injectable()
export class CountryFactory {
  constructor() {}

  public async format({ name }: IUnformattedCountry): Promise<CountryDto> {
    const FORMATTED_COUNTRY: CountryDto = {
      name,
      urlSlug: formatUrlSlug(name),
    };

    const errors = await validate(FORMATTED_COUNTRY);

    if (errors.length) {
      throw new Error('Country ' + name + 'could not be formatted properly');
    }

    return FORMATTED_COUNTRY;
  }
}
