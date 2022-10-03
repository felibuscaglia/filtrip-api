import { IsDefined, IsLowercase, IsNotEmpty, IsString } from 'class-validator';

interface ITeleportCountry {
  href: string;
  name: string;
}

export interface ITeleportCountryDto {
  _links: {
    'country:items': ITeleportCountry[];
  };
}

export interface IUnformattedCountry {
    name: string;
}

export class CountryDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsLowercase()
  urlSlug: string;
}
