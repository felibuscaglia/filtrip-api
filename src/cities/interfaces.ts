interface ITeleportCity {
  name: string;
  href: string;
}

export interface ITeleportCityDto {
  _links: {
    "ua:item": ITeleportCity[];
  }
}

export interface IUnformattedCity {
  name: string;
}