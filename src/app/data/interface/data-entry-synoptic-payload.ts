export interface SynopticPayload {
  station_id: string;
  yyyy?: number,
  mm?: number,
  dd?: number,
  hh?: number,
  entry_datetime: Date;
  val_elem106: number; // Pressure station, PRESST
  val_elem107: number; // Pressure sea level, PRESSL
  val_elem400: number; // 3 Hr Pressure Change, 3HRPPPCHANGE
  val_elem814: number; // 2 Hr Pressure Characteriszit, 3HRpppChar
  val_elem399: number; // Pressure Tendency 24 hly, PRESSTEND
  val_elem301: number; // Pressure Level, PRESS
  val_elem185: number; // Reduced Pressure Geopotential Metres, PREGPM
  val_elem101: number; // Temperature dry bulb, TEMPDB
  val_elem102: number; // Temperature wet bulb, TEMPWB
  val_elem103: number; // Temperature dew point, TEMPDP
  val_elem105: number; // Relative humidity at 06Z, RELHUM
  val_elem192: number; // Cloud height of the lowest layer, LCHGHT
  val_elem110: number; // Visibility horizontal, VISBY
  val_elem114: number; // Cloud cover total, CLDTOT
  val_elem112: number; // Wind Direction
  val_elem111: number; // Wind Speed
  val_elem167: number; // Present Weather (WMO Synoptic Code), PRSWX
  val_elem197: number; // Visibility Maximum (00-89), MAXVIS
  val_elem193: number; // Cloud Medium Level Type, MCTYPE
  val_elem115: number; // Cloud opacity total, CLDOPC
  val_elem168: number; // Cloud amount type height level 1 (WMO code), CLD-1
  val_elem169: number; // Cloud amount type height level 2 (WMO code), CLD-2
  val_elem170: number; // Cloud amount type height level 3 (WMO code), CLD-3
  val_elem171: number; // Cloud amount type height level 4 (WMO code), CLD-4
  val_elem119: number; // Cloud opacity of the lowest layer, CLDOP1
  val_elem116: number; // Cloud amount of the lowest layer, ALDAM1
  val_elem117: number; // Cloud type Low, TYPC01
  val_elem118: number; // Cloud height of the lowest layer, CLDHT1
  val_elem123: number; // Cloud opacity of the second layer, CDOP2
  val_elem120: number; // Cloud amount of the second layer, CLDAM2
  val_elem121: number; // Cloud type of the second layer, CLDTY2
  val_elem122: number; // Cloud height of the second layer, CLDHT2
  val_elem127: number; // Cloud opacity of the third layer, CLDOP3
  val_elem124: number; // Cloud amount of the third layer, CLDAM3
  val_elem125: number; // Cloud type of the third layer, CLDTY3
  val_elem126: number; // Cloud height of the third layer, CLDHT3
  val_elem131: number; // Cloud opacity of the fourth layer, CLDAP4
  val_elem128: number; // Cloud amount of the fourth layer, CLDAM4
  val_elem129: number; // Cloud type of the fourth layer, CLDTY4
  val_elem130: number; // Cloud height of the fourth layer, CLDHT4
  val_elem002: number; // Temperature daily maximum, TMPMAX
  val_elem003: number; // Temperature daily minimum, TMPMIN
  val_elem099: number; // Wind Totalizer at 06Z, WINDRUN08
  val_elem018: number; // Evaporation pan1 daily total, EVAPPN1
  val_elem084: number; // Sunshine Daily total amount, SUNSHN
  val_elem132: number; // Sunshine total hourly, SUN
  val_elem005: number; // Precipitation daily total, PRECIP
  val_elem174: number; // Precipitation total 3 hourly, 3HPRCP
  val_elem046: number; // Insolation daily total on a horizontal surface, INSOL
  flag106: string;
  flag107: string;
  flag400: string;
  flag814: string;
  flag399: string;
  flag301: string;
  flag185: string;
  flag101: string;
  flag102: string;
  flag103: string;
  flag105: string;
  flag192: string;
  flag110: string;
  flag114: string;
  flag112: string;
  flag111: string;
  flag167: string;
  flag197: string;
  flag193: string;
  flag115: string;
  flag168: string;
  flag169: string;
  flag170: string;
  flag171: string;
  flag119: string;
  flag116: string;
  flag117: string;
  flag118: string;
  flag123: string;
  flag120: string;
  flag121: string;
  flag122: string;
  flag127: string;
  flag124: string;
  flag125: string;
  flag126: string;
  flag131: string;
  flag128: string;
  flag129: string;
  flag130: string;
  flag002: string;
  flag003: string;
  flag099: string;
  flag018: string;
  flag084: string;
  flag132: string;
  flag005: string;
  flag174: string;
  flag046: string;
}

export interface SynopticRAPayload {
  station_id: string;
  yyyy?: number,
  mm?: number,
  dd?: number,
  hh?: number,
  entry_datetime: Date;
  val_elem106: number; // Pressure station, PRESST
  val_elem107: number; // Pressure sea level, PRESSL
  val_elem400: number; // 3 Hr Pressure Change, 3HRPPPCHANGE
  val_elem814: number; // 2 Hr Pressure Characteriszit, 3HRpppChar
  val_elem399: number; // Pressure Tendency 24 hly, PRESSTEND
  val_elem301: number; // Pressure Level, PRESS
  val_elem185: number; // Reduced Pressure Geopotential Metres, PREGPM
  val_elem101: number; // Temperature dry bulb, TEMPDB
  val_elem102: number; // Temperature wet bulb, TEMPWB
  val_elem103: number; // Temperature dew point, TEMPDP
  val_elem105: number; // Relative humidity at 06Z, RELHUM
  val_elem192: number; // Cloud height of the lowest layer, LCHGHT
  val_elem110: number; // Visibility horizontal, VISBY
  val_elem114: number; // Cloud cover total, CLDTOT
  val_elem112: number; // Wind Direction
  val_elem111: number; // Wind Speed
  val_elem167: number; // Present Weather (WMO Synoptic Code), PRSWX
  val_elem197: number; // Visibility Maximum (00-89), MAXVIS
  val_elem193: number; // Cloud Medium Level Type, MCTYPE
  val_elem115: number; // Cloud opacity total, CLDOPC
  val_elem168: number; // Cloud amount type height level 1 (WMO code), CLD-1
  val_elem169: number; // Cloud amount type height level 2 (WMO code), CLD-2
  val_elem170: number; // Cloud amount type height level 3 (WMO code), CLD-3
  val_elem171: number; // Cloud amount type height level 4 (WMO code), CLD-4
  val_elem119: number; // Cloud opacity of the lowest layer, CLDOP1
  val_elem116: number; // Cloud amount of the lowest layer, ALDAM1
  val_elem117: number; // Cloud type Low, TYPC01
  val_elem118: number; // Cloud height of the lowest layer, CLDHT1
  val_elem123: number; // Cloud opacity of the second layer, CDOP2
  val_elem120: number; // Cloud amount of the second layer, CLDAM2
  val_elem121: number; // Cloud type of the second layer, CLDTY2
  val_elem122: number; // Cloud height of the second layer, CLDHT2
  val_elem127: number; // Cloud opacity of the third layer, CLDOP3
  val_elem124: number; // Cloud amount of the third layer, CLDAM3
  val_elem125: number; // Cloud type of the third layer, CLDTY3
  val_elem126: number; // Cloud height of the third layer, CLDHT3
  val_elem131: number; // Cloud opacity of the fourth layer, CLDAP4
  val_elem128: number; // Cloud amount of the fourth layer, CLDAM4
  val_elem129: number; // Cloud type of the fourth layer, CLDTY4
  val_elem130: number; // Cloud height of the fourth layer, CLDHT4
  val_elem002: number; // Temperature daily maximum, TMPMAX
  val_elem003: number; // Temperature daily minimum, TMPMIN
  val_elem099: number; // Wind Totalizer at 06Z, WINDRUN08
  val_elem018: number; // Evaporation pan1 daily total, EVAPPN1
  val_elem084: number; // Sunshine Daily total amount, SUNSHN
  val_elem132: number; // Sunshine total hourly, SUN
  val_elem005: number; // Precipitation daily total, PRECIP
  val_elem174: number; // Precipitation total 3 hourly, 3HPRCP
  val_elem046: number; // Insolation daily total on a horizontal surface, INSOL
  flag106: string;
  flag107: string;
  flag400: string;
  flag814: string;
  flag399: string;
  flag301: string;
  flag185: string;
  flag101: string;
  flag102: string;
  flag103: string;
  flag105: string;
  flag192: string;
  flag110: string;
  flag114: string;
  flag112: string;
  flag111: string;
  flag167: string;
  flag197: string;
  flag193: string;
  flag115: string;
  flag168: string;
  flag169: string;
  flag170: string;
  flag171: string;
  flag119: string;
  flag116: string;
  flag117: string;
  flag118: string;
  flag123: string;
  flag120: string;
  flag121: string;
  flag122: string;
  flag127: string;
  flag124: string;
  flag125: string;
  flag126: string;
  flag131: string;
  flag128: string;
  flag129: string;
  flag130: string;
  flag002: string;
  flag003: string;
  flag099: string;
  flag018: string;
  flag084: string;
  flag132: string;
  flag005: string;
  flag174: string;
  flag046: string;
}

export interface SynopticState {
  station: number,
  year:    number,
  month:   number,
  day:     number,
  hour:    number,
}
