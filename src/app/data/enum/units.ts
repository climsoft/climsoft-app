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
  Metre = 'Metre'
}

export enum VisibilityUnit {
  Metres = 'Metres',
  Kilometres = 'Kilometres',
  StatuteMiles = 'Statute Miles'
}

export const TemperatureUnits = [
  { key: 'Celsius', value: TemperatureUnit.Celsius, symbol: '°C' },
  { key: 'DegreeF', value: TemperatureUnit.DegreeF, symbol: '°F' }
];

export const PrecepitationUnits = [
  { key: 'mm', value: PrecipitationUnit.mm, symbol: 'mm' },
  { key: 'cm', value: PrecipitationUnit.cm, symbol: 'mm' },
  { key: 'in', value: PrecipitationUnit.in, symbol: 'in' }
];

export const CloudHeightUnits = [
  { key: 'Feet', value: CloudHeightUnit.Foot, symbol: 'ft' },
  { key: 'Metre', value: CloudHeightUnit.Metre, symbol: 'M' }
];

export const VisibilityUnits = [
  { key: 'Metres', value: VisibilityUnit.Metres, symbol: 'M' },
  { key: 'Metres', value: VisibilityUnit.Kilometres, symbol: 'Km' },
  { key: 'Metres', value: VisibilityUnit.StatuteMiles, symbol: 'M' }
];

export const UnitOptions = {
  temperature: TemperatureUnits,
  precipitation: PrecepitationUnits,
  cloudHeight: CloudHeightUnits,
  visibility: VisibilityUnits
};
