import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/entities';
import { TELEPORT_API_URL } from 'src/lib/constants';
import { TELEPORT_ENDPOINT } from 'src/lib/enums';
import { Repository } from 'typeorm';
import { CountryFactory } from './country.factory';
import { ITeleportCountryDto, IUnformattedCountry } from './interfaces';

@Injectable()
export class CountriesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly countryFactory: CountryFactory,
    @InjectRepository(Country)
    private readonly countriesRepository: Repository<Country>,
  ) {}

  private readonly logger = new Logger('CountriesService');

  private async getCountriesJob() {
    this.logger.log('Started execution of countries job');
    const { data } = await this.httpService.axiosRef.get<ITeleportCountryDto>(
      `${TELEPORT_API_URL}/${TELEPORT_ENDPOINT.COUNTRY}/`,
    );

    for (const COUNTRY_DTO of data._links['country:items']) {
      const UNFORMATTED_COUNTRY: IUnformattedCountry = {
        name: COUNTRY_DTO.name,
      };

      try {
        const COUNTRY = await this.countryFactory.format(UNFORMATTED_COUNTRY);
        await this.countriesRepository.save(COUNTRY);
        this.logger.log('Successfully saved ' + COUNTRY.name);
      } catch (err) {
        this.logger.error(
          'Could not save country with following data: ' + UNFORMATTED_COUNTRY,
        );
      }
    }
  }
}
