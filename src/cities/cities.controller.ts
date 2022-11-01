import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CitiesService } from './cities.service';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  getCities(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('attributes', ParseArrayPipe) attributes: string[],
    @Query('name') name?: string,
  ) {
    return this.citiesService.getCities(page, limit, attributes, name);
  }

  @Get('/:urlSlug')
  async getCity(@Param('urlSlug') urlSlug: string) {
    const city = await this.citiesService.getCityByUrlSlug(urlSlug);

    if (!city) {
      throw new NotFoundException('City not found');
    }

    return city;
  }
}
