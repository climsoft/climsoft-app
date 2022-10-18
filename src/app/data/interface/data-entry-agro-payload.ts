export interface AgroPayload {
  station_id: string,
  yyyy?: number,
  mm?: number,
  dd?: number,
  val_elem101: string, // Temperature dry bulb, TEMPDB
  val_elem102: string, // Temperature wet bulb, TEMPWB
  val_elem103: string, // Temperature dew point, TEMPDP
  val_elem105: string, // Relative humidity at 06Z, RELHUM
  val_elem002: string, // Temperature daily maximum, TMPMAX
  val_elem003: string, // Temperature daily minimum, TMPMIN
  val_elem099: string, // Wind Totalizer at 06Z, WINDRUN08
  val_elem072: string, // TT sol 5cm quot, TTS005
  val_elem073: string, // TT sol 10cm quot, TTS010
  val_elem074: string, // TT sol 20cm quot, TTS020
  val_elem554: string, // Temperature soil 20 cm at 05Z, SOILT0530
  val_elem075: string, // Temperature soil daily at 50 cm, SOIL50
  val_elem076: string, // Temperature soil daily at 100 cm, SOIL1M
  val_elem561: string, // Temperature soil 5 cm at 09Z, SOILT0905
  val_elem562: string, // Temperature soil 10 cm at 09Z, SOILT0910
  val_elem563: string, // Temperature soil 20 cm at 09Z, SOILT0920
  val_elem513: string, // Wind mileage daily, WDRN
  val_elem005: string, // Precipitation daily total, PRECIP
  val_elem504: string, // Precipitation total hours, PRECIPDR
  val_elem532: string, // Sunshine total hours, SUNHRS
  val_elem137: string, // Radiation total downward, RADDWN
  val_elem018: string, // Evaporation pan1 daily total, EVAPPN1
  val_elem518: string, // Evaporation pan2 daily total, EVAPPN1
  val_elem511: string, // Temperature dry bulb at 12 Z, TEMPDB12
  val_elem512: string, // Temperature wet bulb at 12Z, TEMPWB12
  val_elem503: string, // Temperature dew point at 12Z, TEMPDP12
  val_elem515: string, // Relative humidity at 12Z, RELHUM12
  val_elem564: string, // Temperature soil 5 cm at 13Z, SOILT1305
  val_elem565: string, // Temperature soil 10 cm at 13Z, SOILT1310
  val_elem566: string, // Temperature soil 20 cm at 13Z, SOILT1320
  val_elem531: string, // Temperature daily maximum reset, TMPMXRST
  val_elem530: string, // Temperature daily minimum reset, TMPMNRST
  val_elem541: string, // Soil Moisture daily at 5 cm, SOILMST005
  val_elem542: string, // Soil Moisture daily at 100 cm, SOILMST100
  flag101: string,
  flag102: string,
  flag103: string,
  flag105: string,
  flag002: string,
  flag003: string,
  flag099: string,
  flag072: string,
  flag073: string,
  flag074: string,
  flag554: string,
  flag075: string,
  flag076: string,
  flag561: string,
  flag562: string,
  flag563: string,
  flag513: string,
  flag005: string,
  flag504: string,
  flag532: string,
  flag137: string,
  flag018: string,
  flag518: string,
  flag511: string,
  flag512: string,
  flag503: string,
  flag515: string,
  flag564: string,
  flag565: string,
  flag566: string,
  flag531: string,
  flag530: string,
  flag541: string,
  flag542: string,
  signature: string,
  entry_datetime: Date
}

export interface AgroState {
  station: number,
  year:    number,
  month:   number,
  day:     number
}
