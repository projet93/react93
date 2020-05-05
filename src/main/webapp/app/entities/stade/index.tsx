import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Stade from './stade';
import StadeDetail from './stade-detail';
import StadeUpdate from './stade-update';
import StadeDeleteDialog from './stade-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={StadeDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={StadeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={StadeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={StadeDetail} />
      <ErrorBoundaryRoute path={match.url} component={Stade} />
    </Switch>
  </>
);

export default Routes;
