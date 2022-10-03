import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
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
  ) { }

  private readonly logger = new Logger('CountriesService');

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  private async getCountriesJob() {
    this.logger.log('Started execution of countries job');
    const { data: TELEPORT_COUNTRIES_DTO } = await this.httpService.axiosRef.get<ITeleportCountryDto>(
      `${TELEPORT_API_URL}/${TELEPORT_ENDPOINT.COUNTRY}/`,
    );


    for (const COUNTRY_DTO of TELEPORT_COUNTRIES_DTO._links['country:items']) {
      const UNFORMATTED_COUNTRY: IUnformattedCountry = {
        name: COUNTRY_DTO.name,
      };

      try {
        const COUNTRY = await this.countryFactory.format(UNFORMATTED_COUNTRY);
        await this.countriesRepository.save(COUNTRY);
        this.logger.log('Successfully saved ' + COUNTRY.name);
      } catch (err) {
        this.logger.error(
          'Could not save country with following data: ' + JSON.stringify(UNFORMATTED_COUNTRY),
        );
      }
    }
  }
}
