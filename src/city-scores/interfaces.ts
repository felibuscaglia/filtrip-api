import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { City } from 'src/entities';

interface ITeleportCategory {
  color: string;
  name: string;
  score_out_of_10: number;
}

export interface ITeleportScoresDTO {
  categories: ITeleportCategory[];
}

export interface IUnformattedCityScore {
  name: string;
  score: number;
  city: City;
}

export class CityScoreDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(0)
  @Max(10)
  score: number;

  city: City;
}
