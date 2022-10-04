import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from 'src/entities';
import { TELEPORT_API_URL } from 'src/lib/constants';
import { TELEPORT_ENDPOINT } from 'src/lib/enums';
import { PhotosService } from 'src/photos/photos.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CityFactory } from './city.factory';
import { ITeleportCityDetailsDto, ITeleportCityDto, ITeleportCityPhotosDto, IUnformattedCity } from './interfaces';

@Injectable()
export class CitiesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly cityFactory: CityFactory,
    private readonly photosService: PhotosService,
    @InjectRepository(City) private readonly citiesRepository: Repository<City>
  ) { }

  private readonly logger = new Logger('CitiesService');


  @Cron('38 23 * * *')
  private async getCitiesJob() {
    this.logger.log('Starting execution of cities job');

    const { data: TELEPORT_CITIES_DTO } = await this.httpService.axiosRef.get<ITeleportCityDto>(`${TELEPORT_API_URL}/${TELEPORT_ENDPOINT.CITY}/`);

    for (const CITY_DTO of TELEPORT_CITIES_DTO._links['ua:item']) {
      const CITY_NAME = CITY_DTO.name;

      const UNFORMATTED_CITY: IUnformattedCity = {
        name: CITY_NAME
      };

      try {
        const CITY = await this.cityFactory.format(UNFORMATTED_CITY);
        const SAVED_CITY = await this.findBy({ urlSlug: CITY.urlSlug });
        const CITY_ENTITY = await this.citiesRepository.save({
          id: SAVED_CITY.id,
          ...CITY
        } ?? CITY);

        // City details
        this.logger.log('Saving photos from ' + CITY_NAME);
        const { data: CITY_DETAILS_DTO } = await this.httpService.axiosRef.get<ITeleportCityDetailsDto>(CITY_DTO.href);
        await this.saveCityPhotos(CITY_DETAILS_DTO._links['ua:images'].href, CITY_ENTITY);
        this.logger.log('Saved all images from ' + CITY_NAME);

        this.logger.log('Successfully saved ' + CITY_NAME);
      } catch (err) {
        this.logger.error(
          'Could not save city with following data: ' + JSON.stringify(UNFORMATTED_CITY),
        );
        this.logger.error(err);
      }
    }

    this.logger.log('Finished execution of cities job');
  }

  private async saveCityPhotos(photosHref: string, city: City) {
    const { data: PHOTOS_DTO } = await this.httpService.axiosRef.get<ITeleportCityPhotosDto>(photosHref);

    for (const PHOTO of PHOTOS_DTO.photos) {
      await this.photosService.save({
        url: PHOTO.image.web,
        city
      });
    }
  }

  private findBy(whereOptions: FindOptionsWhere<City>) {
    return this.citiesRepository.findOneBy(whereOptions);
  }
}
