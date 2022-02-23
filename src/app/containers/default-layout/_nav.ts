import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'Stations',
    url: '/stations',
    iconComponent: { name: 'cil-location-pin' },
    badge: { color: 'info', text: '280' }
  },
  {
    name: 'Elements',
    url: '/elements',
    iconComponent: { name: 'cil-puzzle' },
    badge: { color: 'info', text: '850' }
  },
  {
    name: 'Instruments',
    url: '/instruments',
    iconComponent: { name: 'cil-apps-settings' },
    badge: { color: 'info', text: '190' }
  },
  {
    title: true,
    name: 'Theme'
  },
  {
    name: 'Colors',
    url: '/theme/colors',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Typography',
    url: '/theme/typography',
    linkProps: { fragment: 'someAnchor' },
    iconComponent: { name: 'cil-pencil' }
  },
  /*
  {
    title: true,
    name: 'Extras'
  }
  */
];
