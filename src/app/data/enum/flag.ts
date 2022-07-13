export enum Flag {
  M = 'M',
  T = 'T',
  E = 'E',
  G = 'G',
  D = 'D'
}

export const Flags: string[] = ['M', 'T', 'E', 'G', 'D'];

export const  FlagsConfig: any = {
  M: { label: 'Missing', class: 'btn-missing' },
  T: { label: 'Trace', class: 'btn-trace' },
  E: { label: 'Estimated', class: 'btn-estimated' },
  G: { label: 'Generated', class: 'btn-generated' },
  D: { label: 'Dubious', class: 'btn-dubious' }
};
