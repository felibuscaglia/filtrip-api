import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { City } from './city.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn({ name: 'photo_id' })
  id: number;

  @Column({ nullable: false })
  url: string;

  @ManyToOne(() => City, (city) => city.photos)
  @JoinColumn({ name: 'city_id' })
  city: City;
}
