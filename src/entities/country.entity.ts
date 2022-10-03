import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Country {
  @PrimaryGeneratedColumn({ name: 'country_id' })
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true, name: 'url_slug' })
  urlSlug: string;
}
