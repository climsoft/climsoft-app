export enum Locale {
  EnglishCanada = 'en-CA',
  EnglishGreatBritain = 'en-GB',
  EnglishUnitedStates = 'en-US',
  FrenchCanada = 'fr-CA',
  FrenchFrance = 'fr-FR'
}

const LocaleValues: any = {
  EnglishCanada: 'English Canada',
  EnglishGreatBritain: 'English Great Britain',
  EnglishUnitedStates: 'English US',
  FrenchCanada: 'French Canada',
  FrenchFrance: 'French France'
};

export function getLocales(): any[] {
  let result: any = [];
  const localeList: any = JSON.parse(JSON.stringify(Locale));
  const raw = Object.keys(localeList).forEach((k) => {
    result.push({ key: localeList[k], value: LocaleValues[k] });
  });

  return result;
}
