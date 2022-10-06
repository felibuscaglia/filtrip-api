import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Country } from '.';
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

  @OneToMany(() => Photo, (photo) => photo.city)
  photos: Photo[];

  @ManyToOne(() => Country, (country) => country.cities)
  @JoinColumn({ name: 'country_id' })
  country: Country;
}
