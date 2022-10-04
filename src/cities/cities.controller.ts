import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { CitiesService } from './cities.service';

@Controller('cities')
export class CitiesController {
  constructor(
    private readonly citiesService: CitiesService
  ) { }

  @Get()
  getCities(@Query('page', ParseIntPipe) page: number, @Query('limit', ParseIntPipe) limit?: number) {
    return this.citiesService.getCities(page, limit);
  }
}
