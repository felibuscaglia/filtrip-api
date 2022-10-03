import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class City {
  @PrimaryGeneratedColumn({ name: 'city_id' })
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true, name: 'url_slug' })
  urlSlug: string;
}