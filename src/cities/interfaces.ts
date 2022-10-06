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

export interface ITeleportCityDetailsDto {
  _links: {
    'ua:images': {
      href: string;
    };
    'ua:countries': {
      href: string;
      name: string;
    }[];
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
  country: Country;
}
