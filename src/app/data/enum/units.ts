export enum TemperatureUnit {
  Celsius = 'Degree Celcius',
  DegreeF = 'Degree Fahrenheit'
}

export enum PrecipitationUnit {
  mm = 'Millimeters',
  cm = 'Centimeters',
  in = 'Inches'
}

export enum CloudHeightUnit {
  Foot = 'Feet',
  Metre = 'Metre',
  Kilometres = 'Kilometres'
}

export enum VisibilityUnit {
  Metres = 'Metres',
  Kilometres = 'Kilometres',
  StatuteMiles = 'Statute Miles'
}

export const TemperatureUnits = [
  { key: 'DEGREE CELSIUS', value: TemperatureUnit.Celsius, symbol: '°C' },
  { key: 'DEGREE FAHRENHEIT', value: TemperatureUnit.DegreeF, symbol: '°F' }
];

export const PrecepitationUnits = [
  { key: 'MILIMETER', value: PrecipitationUnit.mm, symbol: 'mm' },
  { key: 'CENTIMETER', value: PrecipitationUnit.cm, symbol: 'mm' },
  { key: 'INCHE', value: PrecipitationUnit.in, symbol: 'in' }
];

export const CloudHeightUnits = [
  { key: 'FEET', value: CloudHeightUnit.Foot, symbol: 'ft' },
  { key: 'METRE', value: CloudHeightUnit.Metre, symbol: 'M' },
  { key: 'KILOMETERS', value: CloudHeightUnit.Kilometres, symbol: 'M' }
];

export const VisibilityUnits = [
  { key: 'METRES', value: VisibilityUnit.Metres, symbol: 'M' },
  { key: 'KILOMETRES', value: VisibilityUnit.Kilometres, symbol: 'Km' },
  { key: 'STATUTE MILES', value: VisibilityUnit.StatuteMiles, symbol: 'M' }
];

export const UnitOptions = {
  temperature: TemperatureUnits,
  precipitation: PrecepitationUnits,
  cloudHeight: CloudHeightUnits,
  visibility: VisibilityUnits
};
