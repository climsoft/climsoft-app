export enum Flag {
  X = ' ',
  M = 'M',
  T = 'T',
  E = 'E',
  G = 'G',
  D = 'D'
}

export const Flags: string[] = ['M', 'T', 'E', 'G', 'D'];

export const  FlagsConfig: any = {
  M: { label: 'Missing', class: 'btn-light' },
  T: { label: 'Trace', class: 'btn-dark' },
  E: { label: 'Estimated', class: 'btn-secondary' },
  G: { label: 'Generated', class: 'btn-info' },
  D: { label: 'Dubious', class: 'btn-warning' }
};
