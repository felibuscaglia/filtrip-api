import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Photo } from "./photo.entity";

@Entity()
export class City {
  @PrimaryGeneratedColumn({ name: 'city_id' })
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true, name: 'url_slug' })
  urlSlug: string;

  @OneToMany(() => Photo, (photo) => photo.city)
  photos: Photo[]
}