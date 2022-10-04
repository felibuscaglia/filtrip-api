import { IsDefined, IsLowercase, IsNotEmpty, IsString } from "class-validator";

interface ITeleportCity {
  name: string;
  href: string;
}

export interface ITeleportCityDto {
  _links: {
    "ua:item": ITeleportCity[];
  }
}

export interface ITeleportCityDetailsDto {
  _links: {
    "ua:images": {
      href: string;
    },
  }
}

interface ITeleportPhoto {
  attribution: {
    license: string;
    photographer: string;
    site: string;
    source: string;
  },
  image: {
    mobile: string;
    web: string;
  }
}

export interface ITeleportCityPhotosDto {
  photos: ITeleportPhoto[];
}

export interface IUnformattedCity {
  name: string;
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
}