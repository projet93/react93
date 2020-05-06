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
    <MenuItem icon="tachometer-alt" to="/admin/metrics">
      <Translate contentKey="global.menu.admin.metrics">Metrics</Translate>
    </MenuItem>
    <MenuItem icon="heart" to="/admin/health">
      <Translate contentKey="global.menu.admin.health">Health</Translate>
    </MenuItem>
    <MenuItem icon="list" to="/admin/configuration">
      <Translate contentKey="global.menu.admin.configuration">Configuration</Translate>
    </MenuItem>
    <MenuItem icon="bell" to="/admin/audits">
      <Translate contentKey="global.menu.admin.audits">Audits</Translate>
    </MenuItem>
    {/* jhipster-needle-add-element-to-admin-menu - JHipster will add entities to the admin menu here */}
    <MenuItem icon="tasks" to="/admin/logs">
      <Translate contentKey="global.menu.admin.logs">Logs</Translate>
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
