import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { Translate, translate } from 'react-jhipster';
import { NavDropdown } from './menu-components';

export const EntitiesMenu = props => (
  <NavDropdown
    icon="th-list"
    name={translate('global.menu.entities.main')}
    id="entity-menu"
    style={{ maxHeight: '80vh', overflow: 'auto' }}
  > 

    <MenuItem icon="asterisk" to="/stade">
      <Translate contentKey="global.menu.entities.stade" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/categorie">
      <Translate contentKey="global.menu.entities.categorie" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/referent">
      <Translate contentKey="global.menu.entities.referent" />
    </MenuItem> 
    
    
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown> 
);
