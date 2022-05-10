export interface IDataEntryForm {
  isEditable: boolean;
  isModified: boolean;
}

export interface HourlyRecord {
  hour:    number;
  value:  number;
  flag:   string;
}

export interface MonthlyRecord {
  month: string;
  value:  number;
  flag:   string;
  period: number;
}
