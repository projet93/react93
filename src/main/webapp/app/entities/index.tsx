import React from 'react';
import { Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Club from './club';
import Stade from './stade';
import Categorie from './categorie';
import Referent from './referent';
import Plateau from './plateau';
import Inscription from './inscription';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}club`} component={Club} />
      <ErrorBoundaryRoute path={`${match.url}stade`} component={Stade} />
      <ErrorBoundaryRoute path={`${match.url}categorie`} component={Categorie} />
      <ErrorBoundaryRoute path={`${match.url}referent`} component={Referent} />
      <ErrorBoundaryRoute path={`${match.url}plateau`} component={Plateau} />
      <ErrorBoundaryRoute path={`${match.url}inscription`} component={Inscription} />
      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
