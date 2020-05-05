import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Club from './club';
import ClubDetail from './club-detail';
import ClubUpdate from './club-update';
import ClubDeleteDialog from './club-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ClubDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ClubUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ClubUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ClubDetail} />
      <ErrorBoundaryRoute path={match.url} component={Club} />
    </Switch>
  </>
);

export default Routes;
