import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ENTITY } from 'src/lib/enums';
import { PageVisitsService } from 'src/page-visits/page-visits.service';

@Injectable()
export class VisitsCountMiddleware implements NestMiddleware {
  constructor(private readonly visitsCountService: PageVisitsService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const [ENTITY_SLUG = '', URL_SLUG] = req.url
      .slice(1, req.url.length)
      .split('/');

    this.visitsCountService.savePageVisit(
      ENTITY[ENTITY_SLUG.toUpperCase()],
      URL_SLUG,
    );

    next();
  }
}
