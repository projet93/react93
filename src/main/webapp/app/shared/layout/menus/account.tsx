import React, { useState } from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink as Link } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';
import { NavDropdown } from './menu-components';
import { Referent, Stade } from '../header/header-components';
import { relativeTimeRounding } from 'moment';



const StadeReferent = () => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  if(!isAdmin)
  return (
    
      <div>
    <MenuItem icon="list" to="/stade">
        <Translate contentKey="global.menu.entities.stade">Stade</Translate>
     </MenuItem>
    
     <MenuItem icon="user" to="/referent">
        <Translate contentKey="global.menu.entities.referent">Referent</Translate>
     </MenuItem>
     </div>
    )
    else 
     return null;
  
};
const accountMenuItemsAuthenticated = (
  <>
    <MenuItem icon="wrench" to="/account/settings">
      <Translate contentKey="global.menu.account.settings">Settings</Translate>
    </MenuItem>
    <MenuItem icon="lock" to="/account/password">
      <Translate contentKey="global.menu.account.password">Password</Translate>
    </MenuItem>
    <StadeReferent/>
    <MenuItem icon="sign-out-alt" to="/logout">
      <Translate contentKey="global.menu.account.logout">Sign out</Translate>
    </MenuItem>
  </>
);

const accountMenuItems = (
  <>
    <MenuItem id="login-item" icon="sign-in-alt" to="/login">
      <Translate contentKey="global.menu.account.login">Sign in</Translate>
    </MenuItem>
  </>
);

export const AccountMenu = ({ isAuthenticated = false }) => (
  <NavDropdown icon="user" name={translate('global.menu.account.main')} id="account-menu">
    {isAuthenticated ? accountMenuItemsAuthenticated : accountMenuItems}
  </NavDropdown>
);

export default AccountMenu;
