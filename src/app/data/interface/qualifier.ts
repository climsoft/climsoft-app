export interface Qualifier {
  belongs_to: string;
  qualifier: string;
  qualifier_begin_date: Date;
  qualifier_end_date: Date;
  station_timezone: string;
  station_network_type: string;
}

export interface QualifiersState {
  qualifiers: Qualifier[],
  limit: number;
  page: number;
  pages: number;
}

