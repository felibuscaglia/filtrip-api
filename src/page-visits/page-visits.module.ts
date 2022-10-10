import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageVisitReport } from 'src/entities';
import { PageVisitsService } from './page-visits.service';

@Module({
  providers: [PageVisitsService],
  imports: [TypeOrmModule.forFeature([PageVisitReport])],
  exports: [PageVisitsService]
})
export class PageVisitsModule {}
