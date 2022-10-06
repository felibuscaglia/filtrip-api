import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { CountriesService } from 'src/countries/countries.service';
import { formatUrlSlug } from 'src/lib/helpers';
import { CityDto, IUnformattedCity } from './interfaces';

@Injectable()
export class CityFactory {
  constructor(private readonly countriesService: CountriesService) {}

  public async format({
    name,
    countryName,
  }: IUnformattedCity): Promise<CityDto> {
    const FORMATTED_CITY: CityDto = {
      name,
      urlSlug: formatUrlSlug(name),
      country: await this.countriesService.findOneBy({
        where: {
          urlSlug: formatUrlSlug(countryName),
        },
      }),
    };

    const errors = await validate(FORMATTED_CITY);

    if (errors.length) {
      throw new Error('City ' + name + 'could not be formatted properly');
    }

    return FORMATTED_CITY;
  }
}
