import { CONTINENT } from 'src/lib/enums';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { City } from '.';

@Entity()
export class Country {
  @PrimaryGeneratedColumn({ name: 'country_id' })
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true, name: 'url_slug' })
  urlSlug: string;

  @Column({ nullable: false, default: '', enum: CONTINENT })
  continent: CONTINENT;

  @OneToMany(() => City, (city) => city.country)
  cities: City[];
}
