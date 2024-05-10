import { uniqueId } from 'lodash';
import { IconPoint, IconFileDescription, IconUserCircle, IconPackage, IconChartDots, IconAperture, IconSettings, IconMessageDots } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';

export default function Menuitems() {
  const { data: session, status } = useSession();
  console.log("Monyancha Enock", session);
  const menuItems = [
    {
      navlabel: true,
      subheader: 'Home',
    },
    {
      id: uniqueId(),
      title: 'Dashboard',
      icon: IconAperture,
      href: '/dashboard',
    },
    {
      navlabel: true,
      subheader: 'Management',
    },

    // Admin Menu Items
    ...(session?.user?.role_id === 1 ? [
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
        title: 'Menzies Staff',
        icon: IconUserCircle,
        href: '#',
        children: [
          {
            id: uniqueId(),
            title: 'All Staff',
            icon: IconPoint,
            href: '/visitors/menzies',
          },
          {
            id: uniqueId(),
            title: 'Checked In',
            icon: IconPoint,
            href: '/visitors/menziesin',
          },
          {
            id: uniqueId(),
            title: 'Checked Out',
            icon: IconPoint,
            href: '/visitors/menziesout',
          },
        ],
      },
      {
        id: uniqueId(),
        title: 'Other Staff',
        icon: IconUserCircle,
        href: '#',
        children: [
          {
            id: uniqueId(),
            title: 'All Staff',
            icon: IconPoint,
            href: '/visitors/otherstaff',
          },
          {
            id: uniqueId(),
            title: 'Checked In',
            icon: IconPoint,
            href: '/visitors/otherstaffin',
          },
          {
            id: uniqueId(),
            title: 'Checked Out',
            icon: IconPoint,
            href: '/visitors/otherstaffout',
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
    ] : []),

    //Menu Items for Agent
    ...(session?.user?.role_id === 4 ? [
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
      // {
      //   id: uniqueId(),
      //   title: 'Rejected Cargo',
      //   icon: IconPoint,
      //   href: '/acceptance/rejected',
      // },
      
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
    ] : []),
    //menu items for security head and security
    ...(session?.user?.role_id === 2 || session?.user?.role_id === 3 ? [
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
    title: 'Menzies Staff',
    icon: IconUserCircle,
    href: '#',
    children: [
      {
        id: uniqueId(),
        title: 'All Staff',
        icon: IconPoint,
        href: '/visitors/menzies',
      },
      {
        id: uniqueId(),
        title: 'Checked In',
        icon: IconPoint,
        href: '/visitors/menziesin',
      },
      {
        id: uniqueId(),
        title: 'Checked Out',
        icon: IconPoint,
        href: '/visitors/menziesout',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Other Staff',
    icon: IconUserCircle,
    href: '#',
    children: [
      {
        id: uniqueId(),
        title: 'All Staff',
        icon: IconPoint,
        href: '/visitors/otherstaff',
      },
      {
        id: uniqueId(),
        title: 'Checked In',
        icon: IconPoint,
        href: '/visitors/otherstaffin',
      },
      {
        id: uniqueId(),
        title: 'Checked Out',
        icon: IconPoint,
        href: '/visitors/otherstaffout',
      },
    ],
  },
    ] : []),
  ];

  return menuItems;
}
