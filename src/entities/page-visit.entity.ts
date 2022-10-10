import { ENTITY } from 'src/lib/enums';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PageVisitReport {
  @PrimaryGeneratedColumn({
    name: 'page_visit_report_id',
  })
  id: number;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ nullable: false, enum: ENTITY })
  entity: ENTITY;

  @Column({ nullable: false, name: 'url_slug' })
  urlSlug: string;

  @Column({ default: 1 })
  count: number = 1;
}
