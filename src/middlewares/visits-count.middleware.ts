import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CitiesService } from 'src/cities/cities.service';
import { ENTITY } from 'src/lib/enums';

@Injectable()
export class VisitsCountMiddleware implements NestMiddleware {
  constructor(private readonly ciitesService: CitiesService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const [ENTITY_SLUG = '', URL_SLUG] = req.url
      .slice(1, req.url.length)
      .split('/');

    switch (ENTITY_SLUG) {
      case ENTITY.CITIES:
        this.ciitesService.sumPageVisit(URL_SLUG);
        break;
    }

    next();
  }
}
