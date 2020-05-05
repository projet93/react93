import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Referent from './referent';
import ReferentDetail from './referent-detail';
import ReferentUpdate from './referent-update';
import ReferentDeleteDialog from './referent-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ReferentDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ReferentUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ReferentUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ReferentDetail} />
      <ErrorBoundaryRoute path={match.url} component={Referent} />
    </Switch>
  </>
);

export default Routes;
