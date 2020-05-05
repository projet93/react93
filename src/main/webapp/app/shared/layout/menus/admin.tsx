import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink as Link } from 'react-router-dom';
import { NavDropdown } from './menu-components';
import { Translate, translate } from 'react-jhipster';

const adminMenuItems = (
  <>
    <MenuItem icon="user" to="/admin/user-management">
      <Translate contentKey="global.menu.admin.userManagement">User management</Translate>
    </MenuItem>
    <MenuItem icon="list" to="/club">
      <Translate contentKey="global.menu.entities.club">Club</Translate>
    </MenuItem>
    <MenuItem icon="tasks" to="/categorie">
      <Translate contentKey="global.menu.entities.categorie">Categorie</Translate>
    </MenuItem>
    
  </>
);



export const AdminMenu = ({ showSwagger }) => (
  <NavDropdown icon="user-plus" name={translate('global.menu.admin.main')} style={{ width: '140%' }} id="admin-menu">
    {adminMenuItems}
    {showSwagger}
  </NavDropdown>
);

export default AdminMenu;
