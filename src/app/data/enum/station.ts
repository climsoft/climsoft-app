export enum StationType {
    AirFixed = 'airFixed',
    AirMobile = 'airMobile',
    LakeRiverFixed = 'lakeRiverFixed',
    LakeRiverMobile = 'lakeRiverMobile',
    LandFixed = 'landFixed',
    LandMobile = 'landMobile',
    LandonIce = 'landOnIce',
    SeaFixed = 'seaFixed',
    SeaMobile = 'seaMobile',
    SeaonIce = 'seaOnIce',
    SpaceBased = 'spaceBased',
    UnderWaterFixed = 'underWaterFixed',
    UnderwaterMobile = 'underWaterMobile',
    UnKnown =	'unknown'
}

const StationTypeValues: any = {
    AirFixed: 'Air Fixed',
    AirMobile: 'Air Mobile',
    LakeRiverFixed: 'Lake River Fixed',
    LakeRiverMobile: 'Lake River Mobile',
    LandFixed: 'Land Fixed',
    LandMobile: 'Land Mobile',
    LandonIce: 'Land On Ice',
    SeaFixed: 'Sea Fixed',
    SeaMobile: 'Sea Mobile',
    SeaonIce: 'Sea On Ice',
    SpaceBased: 'Space Based',
    UnderWaterFixed: 'Under Water Fixed',
    UnderwaterMobile: 'Under Water Mobile',
    UnKnown:	'Unknown'
};

export enum StationClass {
  AgriculturalMeteorological = '',
  AircraftMeteorological = '',
  AutomaticWeather = '',
  Climatological = '',
  Cryosphere = '',
  Precipitation = '',
  RadarWindProfiler = '',
  Radiation = '',
  SeaProfiling = '',
  SpaceWeather = '',
  SurfaceLandMeteorological = '',
  SurfaceMarineMeteorological = '',
  UpperAirPilot = '',
  UpperAirRadiosonde = '',
  WeatherRadar = ''
}

export function getStationTypes(): any[] {
  const obj: any = JSON.parse(JSON.stringify(StationType));
  const result: any[] = [];

  Object.keys(obj).forEach((k) => {
    result.push({ key: StationTypeValues[k], value: obj[k] });
  });

  return result;
}

export function getStationTypeText(type: string) {
  const obj: any = JSON.parse(JSON.stringify(StationType));
  const key = Object.keys(obj).filter(k => obj[k] === type)[0];

  return StationTypeValues[key];
}
