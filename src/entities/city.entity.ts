import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Country } from '.';
import { CityScore } from './city-score.entity';
import { Photo } from './photo.entity';

@Entity()
export class City {
  @PrimaryGeneratedColumn({ name: 'city_id' })
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true, name: 'url_slug' })
  urlSlug: string;

  @Column({ nullable: false })
  region: string;

  @Column({ nullable: false, default: 0, name: 'visits_count' })
  visitsCount: number;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Photo, (photo) => photo.city)
  photos: Photo[];

  @ManyToOne(() => Country, (country) => country.cities)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @OneToMany(() => CityScore, (cityScore) => cityScore.city)
  scores: CityScore[];
}
