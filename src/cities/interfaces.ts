import { IsDefined, IsLowercase, IsNotEmpty, IsString } from 'class-validator';
import { Country } from 'src/entities';

interface ITeleportCity {
  name: string;
  href: string;
}

export interface ITeleportCityDto {
  _links: {
    'ua:item': ITeleportCity[];
  };
}

interface ITeleportLink { 
  href: string;
  name: string;
}

export interface ITeleportCityDetailsDto {
  _links: {
    'ua:images': {
      href: string;
    };
    'ua:countries': ITeleportLink[];
    'ua:admin1-divisions': ITeleportLink[];
  };
}

interface ITeleportPhoto {
  attribution: {
    license: string;
    photographer: string;
    site: string;
    source: string;
  };
  image: {
    mobile: string;
    web: string;
  };
}

export interface ITeleportCityPhotosDto {
  photos: ITeleportPhoto[];
}

export interface IUnformattedCity {
  name: string;
  countryName: string;
  region: string;
}

export class CityDto {
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
  region: string;

  @IsDefined()
  country: Country;
}
