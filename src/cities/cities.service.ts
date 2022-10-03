import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from 'src/entities';
import { TELEPORT_API_URL } from 'src/lib/constants';
import { TELEPORT_ENDPOINT } from 'src/lib/enums';
import { Repository } from 'typeorm';
import { CityFactory } from './city.factory';
import { ITeleportCityDto, IUnformattedCity } from './interfaces';

@Injectable()
export class CitiesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly cityFactory: CityFactory,
    @InjectRepository(City) private readonly citiesRepository: Repository<City>
  ) { }

  private readonly logger = new Logger('CitiesService');


  @Cron('32 16 * * *')
  private async getCitiesJob() {
    this.logger.log('Starting execution of cities job');

    const { data: TELEPORT_CITIES_DTO } = await this.httpService.axiosRef.get<ITeleportCityDto>(`${TELEPORT_API_URL}/${TELEPORT_ENDPOINT.CITY}/`);

    for (const CITY_DTO of TELEPORT_CITIES_DTO._links['ua:item']) {
      const UNFORMATTED_CITY: IUnformattedCity = {
        name: CITY_DTO.name
      };

      try {
        const CITY = await this.cityFactory.format(UNFORMATTED_CITY);
        await this.citiesRepository.save(CITY);
        this.logger.log('Successfully saved ' + CITY.name);
      } catch (err) {
        this.logger.error(
          'Could not save city with following data: ' + JSON.stringify(UNFORMATTED_CITY),
        );
        this.logger.error(err);
      }
    }

    this.logger.log('Finished execution of cities job');
  }
}
