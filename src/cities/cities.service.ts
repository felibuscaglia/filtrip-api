import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TELEPORT_API_URL } from 'src/lib/constants';
import { TELEPORT_ENDPOINT } from 'src/lib/enums';
import { ITeleportCityDto, IUnformattedCity } from './interfaces';

@Injectable()
export class CitiesService {
  constructor(
    private readonly httpService: HttpService
  ) { }

  private readonly logger = new Logger('CitiesService');


  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  private async getCitiesJob() {
    this.logger.log('Starting execution of cities job');

    const { data: TELEPORT_CITIES_DTO } = await this.httpService.axiosRef.get<ITeleportCityDto>(`${TELEPORT_API_URL}/${TELEPORT_ENDPOINT.CITY}/`);

    for (const CITY_DTO of TELEPORT_CITIES_DTO._links['ua:item']) {
      const UNFORMATTED_CITY: IUnformattedCity = {
        name: CITY_DTO.name
      };

      try {

      } catch(err) {
        
      }
    }
  }
}
