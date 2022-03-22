export enum ScreenSize {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl'
}

export const ScreenSizes = [
  { id: ScreenSize.XS, name: 'xs', min: 576, max: 767.98 },
  { id: ScreenSize.SM, name: 'sm', min: 768, max: 991.98 },
  { id: ScreenSize.MD, name: 'md', min: 992, max: 1199.98 },
  { id: ScreenSize.LG, name: 'lg', min: 1200, max: 1399.98 },
  { id: ScreenSize.XL, name: 'xl', min: 1400, max: 5000 }
];
