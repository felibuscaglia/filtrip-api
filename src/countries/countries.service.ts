import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/entities';
import { TELEPORT_API_URL } from 'src/lib/constants';
import { CONTINENT, TELEPORT_ENDPOINT } from 'src/lib/enums';
import { FindOneOptions, Repository } from 'typeorm';
import { CountryFactory } from './country.factory';
import {
  ITeleportCountryDetailsDto,
  ITeleportCountryDto,
  IUnformattedCountry,
} from './interfaces';

@Injectable()
export class CountriesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly countryFactory: CountryFactory,
    @InjectRepository(Country)
    private readonly countriesRepository: Repository<Country>,
  ) {}

  private readonly logger = new Logger('CountriesService');

  public findOneBy(options: FindOneOptions<Country>) {
    return this.countriesRepository.findOne(options);
  }

  @Cron('23 15 * * *')
  private async getCountriesJob() {
    this.logger.log('Started execution of countries job');
    const { data: TELEPORT_COUNTRIES_DTO } =
      await this.httpService.axiosRef.get<ITeleportCountryDto>(
        `${TELEPORT_API_URL}/${TELEPORT_ENDPOINT.COUNTRY}/`,
      );
    let errorCounter = 0;

    for (const COUNTRY_DTO of TELEPORT_COUNTRIES_DTO._links['country:items']) {
      try {
        const { data: COUNTRY_DETAILS_DTO } =
          await this.httpService.axiosRef.get<ITeleportCountryDetailsDto>(
            COUNTRY_DTO.href,
          );
        const UNFORMATTED_COUNTRY: IUnformattedCountry = {
          name: COUNTRY_DTO.name,
          continent:
            CONTINENT[COUNTRY_DETAILS_DTO._links['country:continent'].name],
        };
        const COUNTRY = await this.countryFactory.format(UNFORMATTED_COUNTRY);
        const SAVED_COUNTRY = await this.findOneBy({
          where: { urlSlug: COUNTRY.urlSlug },
        });
        const COUNTRY_ENTITY = await this.countriesRepository.save(
          SAVED_COUNTRY
            ? {
                id: SAVED_COUNTRY.id,
                ...COUNTRY,
              }
            : COUNTRY,
        );
        await this.countriesRepository.save(COUNTRY_ENTITY);
        this.logger.log('Successfully saved ' + COUNTRY.name);
      } catch (err) {
        this.logger.error('Could not save country ' + COUNTRY_DTO.name);
        this.logger.error(err);

        errorCounter++;
      }
    }

    this.logger.log(
      'Finished execution of countries job. ' +
        errorCounter +
        ' errors occurred',
    );
  }
}
