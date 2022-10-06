import { IsDefined, IsEnum, IsLowercase, IsNotEmpty, IsString } from 'class-validator';
import { CONTINENT } from 'src/lib/enums';

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
  continent: CONTINENT;
}

export interface ITeleportCountryDetailsDto {
  _links: {
    'country:continent': {
      href: string;
      name: string;
    };
  };
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

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsEnum(CONTINENT)
  continent: CONTINENT;
}
