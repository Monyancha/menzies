import { uniqueId } from 'lodash';

interface MenuitemsType {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: MenuitemsType[];
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
}
import {
  IconPoint,
  IconFileDescription,
  IconUserCircle,
  IconPackage,
  IconChartDots,
  IconSettings,
  IconSmartHome
} from '@tabler/icons-react';

const Menuitems: MenuitemsType[] = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconSmartHome,
    href: '/dashboard',
  },
  {
    navlabel: true,
    subheader: 'Management',
  },
  {
    id: uniqueId(),
    title: 'Visitors',
    icon: IconUserCircle,
    href: '/visitors',
    children: [
      {
        id: uniqueId(),
        title: 'All Visitors',
        icon: IconPoint,
        href: '/visitors',
      },
      {
        id: uniqueId(),
        title: 'Checked In',
        icon: IconPoint,
        href: '/visitors/checkedin',
      },
      {
        id: uniqueId(),
        title: 'Checked Out',
        icon: IconPoint,
        href: '/visitors/checkedout',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Cargo Status',
    icon: IconFileDescription,
    href: '#',
    children: [
      {
        id: uniqueId(),
        title: 'All Cargo',
        icon: IconPoint,
        href: '/cargo',
      },
      // {
      //   id: uniqueId(),
      //   title: 'General Cargo',
      //   icon: IconPoint,
      //   href: '/cargo/general',
      // },
      // {
      //   id: uniqueId(),
      //   title: 'Known Cargo',
      //   icon: IconPoint,
      //   href: '/cargo/known',
      // },
      // {
      //   id: uniqueId(),
      //   title: 'Unknown Cargo',
      //   icon: IconPoint,
      //   href: '/cargo/unknown',
      // },
      
    ],
  },
  {
    id: uniqueId(),
    title: 'Acceptance',
    icon: IconPackage,
    href: '/acceptance',
    children: [
      {
        id: uniqueId(),
        title: 'Awaiting Acceptance',
        icon: IconPoint,
        href: '/acceptance',
      },
      {
        id: uniqueId(),
        title: 'Accepted Cargo',
        icon: IconPoint,
        href: '/acceptance/accepted',
      },
      {
        id: uniqueId(),
        title: 'Rejected Cargo',
        icon: IconPoint,
        href: '/acceptance/rejected',
      },
      
    ],
  },
  {
    id: uniqueId(),
    title: 'Screening',
    icon: IconPackage,
    href: '/screening',
    children: [
      {
        id: uniqueId(),
        title: 'Awaiting Screening',
        icon: IconPoint,
        href: '/screening',
      },
      {
        id: uniqueId(),
        title: 'Screened Cargo',
        icon: IconPoint,
        href: '/screening/screened',
      },
      {
        id: uniqueId(),
        title: 'Logged Out Cargo',
        icon: IconPoint,
        href: '/screening/loggedout',
      },
      
    ],
  },
  {
    id: uniqueId(),
    title: 'Palleting',
    icon: IconUserCircle,
    href: '#',
    children: [
      {
        id: uniqueId(),
        title: 'Awaiting Palleting',
        icon: IconPoint,
        href: '/palleting',
      },
      {
        id: uniqueId(),
        title: 'Palleted Cargo',
        icon: IconPoint,
        href: '/palleting/palleted',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'ULDs',
    icon: IconUserCircle,
    href: '#',
    children: [
      {
        id: uniqueId(),
        title: 'Awaiting Destination',
        icon: IconPoint,
        href: '/destination',
      },
      {
        id: uniqueId(),
        title: 'Destination Set',
        icon: IconPoint,
        href: '/destination/set',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Aircraft',
    icon: IconChartDots,
    href: '#',
    children: [
      {
        id: uniqueId(),
        title: 'Awaiting Offload',
        icon: IconPoint,
        href: '/aircraft',
      },
      {
        id: uniqueId(),
        title: 'Offloaded Cargo',
        icon: IconPoint,
        href: '/aircraft/offloaded',
      },
      {
        id: uniqueId(),
        title: 'Returned Cargo',
        icon: IconPoint,
        href: '/aircraft/returned',
      },
    ],
  },

  {
    id: uniqueId(),
    title: 'Storage',
    icon: IconFileDescription,
    href: '#',
    children: [
      {
        id: uniqueId(),
        title: 'Awaiting Storage',
        icon: IconPoint,
        href: '/storage',
      },
      {
        id: uniqueId(),
        title: 'Stored Cargo',
        icon: IconPoint,
        href: '/storage/stored',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'ULD Buildup',
    icon: IconFileDescription,
    href: '#',
    children: [
      {
        id: uniqueId(),
        title: 'Received ULDs',
        icon: IconPoint,
        href: '/uldbuildup/receivedulds',
      },
      {
        id: uniqueId(),
        title: 'Issued ULDs',
        icon: IconPoint,
        href: '/uldbuildup/issuedulds',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Imports',
    icon: IconFileDescription,
    href: '#',
    children: [
      {
        id: uniqueId(),
        title: 'Received Imports',
        icon: IconPoint,
        href: '/imports/receivedimports',
      },
      {
        id: uniqueId(),
        title: 'Delivered Imports',
        icon: IconPoint,
        href: '/imports/deliveredimports',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Users',
    icon: IconUserCircle,
    href: '#',
    children: [
      {
        id: uniqueId(),
        title: 'All Users',
        icon: IconPoint,
        href: '/users',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Settings',
    icon: IconSettings,
    href: '#',
    children: [
      {
        id: uniqueId(),
        title: 'General Settings',
        icon: IconPoint,
        href: '/settings',
      },
      {
        id: uniqueId(),
        title: 'Access Control',
        icon: IconPoint,
        href: '/settings/access-control',
      },
    ],
  },
 
];

export default Menuitems;
