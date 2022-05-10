export interface Instrument {
  instrument_id: string;
  instrument_name: string;
  serial_number: string;
  abbreviation: string;
  model: string;
  manufacturer: string;
  instrument_uncertainty: 0;
  installation_datetime: Date;
  deinstallation_datetime: Date;
  height: string;
  instrument_picture: string;
  installed_at: string;
}

export interface InstrumentsState {
  instruments: Instrument[];
  limit: number;
  page: number;
  pages: number;
}
