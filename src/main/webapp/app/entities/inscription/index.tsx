import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Inscription from './inscription';
import InscriptionDetail from './inscription-detail';
import InscriptionUpdate from './inscription-update';
import InscriptionDeleteDialog from './inscription-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={InscriptionDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={InscriptionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={InscriptionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={InscriptionDetail} />
      <ErrorBoundaryRoute path={match.url} component={Inscription} />
    </Switch>
  </>
);

export default Routes;
