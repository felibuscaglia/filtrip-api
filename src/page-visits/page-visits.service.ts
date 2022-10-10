import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageVisitReport } from 'src/entities';
import { ENTITY } from 'src/lib/enums';
import { Repository } from 'typeorm';

@Injectable()
export class PageVisitsService {
  constructor(
    @InjectRepository(PageVisitReport)
    private readonly pageVisitReportRepository: Repository<PageVisitReport>,
  ) {}

  async savePageVisit(entity: ENTITY, urlSlug: string) {
    let pageVisitReport = await this.pageVisitReportRepository.findOneBy({
      date: new Date(),
      urlSlug,
      entity,
    });

    if (pageVisitReport) {
      pageVisitReport.count++;
    } else {
      pageVisitReport = {
        date: new Date(),
        entity,
        urlSlug,
        count: 1,
      } as PageVisitReport;
    }

    this.pageVisitReportRepository.save(pageVisitReport);
  }
}
