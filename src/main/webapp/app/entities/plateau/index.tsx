import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Plateau from './plateau';
import PlateauDetail from './plateau-detail';
import PlateauUpdate from './plateau-update';
import PlateauDeleteDialog from './plateau-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={PlateauDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={PlateauUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={PlateauUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={PlateauDetail} />
      <ErrorBoundaryRoute path={match.url} component={Plateau} />
    </Switch>
  </>
);

export default Routes;
