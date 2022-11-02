import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { City } from '.';

@Entity({ name: 'city_score' })
export class CityScore {
  @PrimaryGeneratedColumn({ name: 'city_score_id' })
  id: number;

  @Column({ nullable: false, type: String })
  name: string;

  @Column({ nullable: false, type: Number })
  score: number;

  @ManyToOne(() => City, (city) => city.scores)
  city: City;
}
