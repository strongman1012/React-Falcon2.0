import React from 'react';
import { Nav } from 'react-bootstrap';
import ProfileDropdown from 'components/navbar/top/ProfileDropdown';
import NotificationDropdown from 'components/navbar/top/NotificationDropdown';

import ModuleActions from './ModuleActions';

const TopNavRightSideNavItem = () => {
  return (
    <Nav
      navbar
      className="navbar-nav-icons ms-auto flex-row align-items-center"
      as="ul"
    >
      <ModuleActions />

      <NotificationDropdown />

      <ProfileDropdown />
    </Nav>
  );
};

export default TopNavRightSideNavItem;
