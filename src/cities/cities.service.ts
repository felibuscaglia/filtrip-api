import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from 'src/entities/city.entity';
import { TELEPORT_API_URL, WIKIPEDIA_API_URL } from 'src/lib/constants';
import { TELEPORT_ENDPOINT } from 'src/lib/enums';
import { PhotosService } from 'src/photos/photos.service';
import {
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  ILike,
  Repository,
} from 'typeorm';
import { CityFactory } from './city.factory';
import {
  ITeleportCityDetailsDto,
  ITeleportCityDto,
  ITeleportCityPhotosDto,
  IUnformattedCity,
  IWikipediaDTO,
  IWikipediaQuery,
} from './interfaces';

@Injectable()
export class CitiesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly cityFactory: CityFactory,
    private readonly photosService: PhotosService,
    @InjectRepository(City) private readonly citiesRepository: Repository<City>,
  ) {}

  private readonly logger = new Logger('CitiesService');

  public getCities(
    page: number,
    limit: number,
    attributes: string[],
    name?: string,
  ) {
    const FIND_OPTIONS: FindManyOptions<City> = {
      skip: page * limit,
      take: limit,
      select: ['id', 'visitsCount', ...attributes] as FindOptionsSelect<City>,
      relations: ['photos', 'country'],
      order: {
        visitsCount: 'DESC',
      },
    };

    if (name) {
      FIND_OPTIONS.where = {
        name: ILike(`${name}%`),
      };
    }

    return this.citiesRepository.find(FIND_OPTIONS);
  }

  public sumPageVisit(urlSlug: string) {
    const SQL = `
    UPDATE city SET visits_count = visits_count + 1 where url_slug = '${urlSlug}'
    `;
    this.citiesRepository.query(SQL);
  }

  public getCityByUrlSlug(urlSlug: string) {
    return this.citiesRepository.findOne({
      where: { urlSlug },
      relations: ['photos', 'country'],
    });
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  private async getCitiesJob() {
    this.logger.log('Starting execution of cities job');

    const { data: TELEPORT_CITIES_DTO } =
      await this.httpService.axiosRef.get<ITeleportCityDto>(
        `${TELEPORT_API_URL}/${TELEPORT_ENDPOINT.CITY}/`,
      );

    for (const CITY_DTO of TELEPORT_CITIES_DTO._links['ua:item']) {
      const CITY_NAME = CITY_DTO.name;

      try {
        const { data: CITY_DETAILS_DTO } =
          await this.httpService.axiosRef.get<ITeleportCityDetailsDto>(
            CITY_DTO.href,
          );
        const UNFORMATTED_CITY: IUnformattedCity = {
          name: CITY_NAME,
          countryName: CITY_DETAILS_DTO._links['ua:countries'][0]?.name,
          region: CITY_DETAILS_DTO._links['ua:admin1-divisions'][0]?.name,
          description: await this.fetchWikipediaDescription(CITY_NAME),
        };

        const CITY = await this.cityFactory.format(UNFORMATTED_CITY);
        const SAVED_CITY = await this.findBy({ urlSlug: CITY.urlSlug });
        const CITY_ENTITY = await this.citiesRepository.save(
          SAVED_CITY
            ? {
                id: SAVED_CITY.id,
                ...CITY,
              }
            : CITY,
        );

        // City details
        this.logger.log('Saving photos from ' + CITY_NAME);
        await this.saveCityPhotos(
          CITY_DETAILS_DTO._links['ua:images'].href,
          CITY_ENTITY,
        );
        this.logger.log('Saved all images from ' + CITY_NAME);

        this.logger.log('Successfully saved ' + CITY_NAME);
      } catch (err) {
        this.logger.error('Could not save city ' + CITY_NAME);
        this.logger.error(err);
      }
    }

    this.logger.log('Finished execution of cities job');
  }

  private async saveCityPhotos(photosHref: string, city: City) {
    const { data: PHOTOS_DTO } =
      await this.httpService.axiosRef.get<ITeleportCityPhotosDto>(photosHref);

    for (const PHOTO of PHOTOS_DTO.photos) {
      await this.photosService.upsert({
        url: PHOTO.image.web,
        city,
      });
    }
  }

  private findBy(whereOptions: FindOptionsWhere<City>) {
    return this.citiesRepository.findOneBy(whereOptions);
  }

  private async fetchWikipediaDescription(query: string) {
    try {
      const { data: WIKIPEDIA_DTO } =
        await this.httpService.axiosRef.get<IWikipediaDTO>(WIKIPEDIA_API_URL, {
          params: {
            format: 'json',
            action: 'query',
            prop: 'extracts',
            explaintext: '1',
            exsentences: '7',
            titles: query,
          },
        });

      if (WIKIPEDIA_DTO) {
        return this.getWikipediaDescriptionFromQuery(WIKIPEDIA_DTO.query);
      } else {
        this.logger.warn('No Wikipedia page found for ' + query);
      }
    } catch (err) {
      this.logger.error(
        'Error ocurred when fetching Wikipedia description for ' + query,
      );
      this.logger.error('Error: ' + JSON.stringify(err));
    }
  }

  private getWikipediaDescriptionFromQuery(query: IWikipediaQuery) {
    const pages = query.pages;
    const keyPages = Object.values(pages);
    return keyPages[0]?.extract ?? null;
  }
}
