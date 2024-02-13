import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilChart, cilSpeedometer, cilMoney, cilBirthdayCake, cilHome, cilGroup } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Usage Data',
  //   to: '/usage',
  //   icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
  // },
  {
    component: CNavItem,
    name: 'Betting',
    to: '/betting',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Game Settings',
    to: '/gameSettings',
    icon: <CIcon icon={cilBirthdayCake} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Tournaments',
    to: '/tournaments',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'EskillzToken',
    to: '/eskillzToken',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Collections',
    to: '/collection',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'NFT Mint',
    to: '/mint',
    icon: <CIcon icon={cilBirthdayCake} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'NFT Market',
    to: '/market',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
]

export default _nav
