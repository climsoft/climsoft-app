import { AppMode } from './../../data/enum/app-mode';
import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'title.station_metadata'
  },
  {
    name: 'stations',
    url: '/stations',
    iconComponent: { name: 'cil-location-pin' },
    badge: { color: 'info', text: '280' }
  },
  {
    name: 'elements',
    url: '/elements',
    iconComponent: { name: 'cil-puzzle' },
    badge: { color: 'info', text: '850' }
  },
  {
    name: 'station_elements',
    url: '/station-elements',
    iconComponent: { name: 'cil-puzzle' },
    badge: { color: 'info', text: '850' }
  },
  {
    name: 'instruments',
    url: '/instruments',
    iconComponent: { name: 'cil-apps-settings' },
    badge: { color: 'info', text: '190' }
  },
  {
    name: 'location_histories',
    url: '/location-histories',
    iconComponent: { name: 'cil-puzzle' },
    badge: { color: 'info', text: '850' }
  },
  {
    name: 'qualifiers',
    url: '/qualifiers',
    iconComponent: { name: 'cil-puzzle' },
    badge: { color: 'info', text: '850' }
  },
  {
    name: 'schedule_class',
    url: '/schedule-classes',
    iconComponent: { name: 'cil-puzzle' },
    badge: { color: 'info', text: '120' }
  },
  {
    name: 'physical_features',
    url: '/physical-features',
    iconComponent: { name: 'cil-puzzle' },
    badge: { color: 'info', text: '850' }
  },
  {
    name: 'paper_archive_definitions',
    url: '/paper-archive-definitions',
    iconComponent: { name: 'cil-puzzle' },
    badge: { color: 'info', text: '850' }
  },
  {
    title: true,
    name: 'title.data_entry'
  },
  {
    name: 'data_entry_forms',
    url: '/data-entry',
    iconComponent: { name: 'cil-clipboard' },
    children: [
      {
        name: 'data_entry.hourly',
        url: '/data-entry/hourly'
      },
      {
        name: 'data_entry.daily',
        url: '/data-entry/daily'
      },
      {
        name: 'data_entry.monthly',
        url: '/data-entry/monthly'
      },
      {
        name: 'data_entry.hourly_wind',
        url: '/data-entry/hourly-wind'
      },
      // {
      //   name: 'data_entry.synoptic-carribiean',
      //   url: '/data-entry/synoptic-carribiean'
      // },
      {
        name: 'data_entry.synoptic-2ra1',
        url: '/data-entry/synoptic-2ra1'
      },
      {
        name: 'data_entry.agromet',
        url: '/data-entry/agro'
      }
    ]
  },
  {
    title: true,
    name: 'title.paper_archive'
  },
  {
    name: 'paper_archive',
    url: '/paper-archives',
    iconComponent: { name: 'cil-puzzle' },
    badge: { color: 'info', text: '850' }
  },
  /*
  {
    title: true,
    name: 'Extras'
  }
  */
];

export const DefaultNavItems = ['Dashboard'];
