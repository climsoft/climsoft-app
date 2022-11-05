export interface IDataEntryForm {
  isEditable: boolean;
  isModified: boolean;
}

export interface HourlyRecord {
  hour:    number;
  value:  number | string;
  flag:   string;
}

export interface HourlyWindRecord {
  hour:   number;
  ddff:   number;
  dd:     number;
  ff:     number;
  flag:   string;
}

export interface MonthlyRecord {
  month: number;
  value:  number;
  flag:   string;
  period: number;
}

export interface ElementLimits {
  lower: number;
  upper: number;
}
