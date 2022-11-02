import { IsDefined, IsLowercase, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
  description?: string;
}

export interface IWikipediaDTO {
  batchcomplete: string;
  query: IWikipediaQuery;
}

export interface IWikipediaQuery {
  pages: IWikipediaPages;
}

export interface IWikipediaPages {
  [key: string]: {
    pageid?: number;
    ns: number;
    title: string;
    extract?: string;
    missing?: string;
  };
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

  @IsOptional()
  description?: string;

  @IsDefined()
  country: Country;
}
