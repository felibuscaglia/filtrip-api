import {
  Controller,
  Get,
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
  ) {
    return this.citiesService.getCities(page, limit, attributes);
  }
}
