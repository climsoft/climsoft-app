export enum Flag {
  N = '',
  M = 'M',
  T = 'T',
  E = 'E',
  G = 'G',
  D = 'D'
}

export const Flags: string[] = ['N', 'M', 'T', 'E', 'G', 'D'];

export const  FlagsConfig: any = {
  N: { label: 'No Flag', class: 'btn-empty' },
  M: { label: 'Missing', class: 'btn-missing' },
  T: { label: 'Trace', class: 'btn-trace' },
  E: { label: 'Estimated', class: 'btn-estimated' },
  G: { label: 'Generated', class: 'btn-generated' },
  D: { label: 'Dubious', class: 'btn-dubious' }
};
