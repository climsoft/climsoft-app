import { AppMode } from './../../data/enum/app-mode';
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
    title: true,
    name: 'Station Metadata'
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
    name: 'Station Elements',
    url: '/station-elements',
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
    name: 'Location Histories',
    url: '/location-histories',
    iconComponent: { name: 'cil-puzzle' },
    badge: { color: 'info', text: '850' }
  },
  {
    name: 'Qualifiers',
    url: '/qualifiers',
    iconComponent: { name: 'cil-puzzle' },
    badge: { color: 'info', text: '850' }
  },
  {
    name: 'Schedule Class',
    url: '/schedule-classes',
    iconComponent: { name: 'cil-puzzle' },
    badge: { color: 'info', text: '120' }
  },
  {
    name: 'Physical Features',
    url: '/physical-features',
    iconComponent: { name: 'cil-puzzle' },
    badge: { color: 'info', text: '850' }
  },
  {
    name: 'Paper Archive',
    url: '/paper-archive',
    iconComponent: { name: 'cil-puzzle' },
    badge: { color: 'info', text: '850' }
  },
  {
    title: true,
    name: 'Data Entry'
  },
  {
    name: 'Data Entry Forms',
    url: '/data-entry',
    iconComponent: { name: 'cil-clipboard' },
    children: [
      {
        name: 'Daily',
        url: '/data-entry/daily'
      },
      {
        name: 'Hourly',
        url: '/data-entry/hourly'
      },
      {
        name: 'Hourly Wind',
        url: '/data-entry/hourly-wind'
      },
      {
        name: 'Monthly',
        url: '/data-entry/monthly'
      },
      {
        name: 'Synoptic',
        url: '/data-entry/synoptic'
      },
      {
        name: 'Agroment',
        url: '/data-entry/agro'
      }
    ]
  }
  /*
  {
    title: true,
    name: 'Extras'
  }
  */
];

export const DefaultNavItems = ['Dashboard'];
