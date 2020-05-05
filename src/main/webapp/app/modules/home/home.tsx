import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';
import GoogleMapReact from 'google-map-react';

export type IHomeProp = StateProps;

export const Home = (props: IHomeProp) => {
  const { account } = props;
  localStorage.setItem('login', account.login);
  return (
    <Row>
      <Col md="9">
        
        
        <div style={{ height: '75vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDj-zgI5H5vSaR9NbLwk7BxCyPiCz3cCTs", language: 'fr' }}
          defaultCenter={{lat: 48.93, lng: 2.40}}
          defaultZoom={12}
        >
          
        </GoogleMapReact>
      </div>
        {account && account.login ? (
          <div>
            <Alert color="success">
              <Translate contentKey="home.logged.message" interpolate={{ username: account.login }}>
                You are logged in as user {account.login}.
              </Translate>
            </Alert>
          </div>
        ) : (
          <div>
            <Alert color="warning">
              <Translate contentKey="global.messages.info.authenticated.prefix">If you want to </Translate>
              <Link to="/login" className="alert-link">
                <Translate contentKey="global.messages.info.authenticated.link"> sign in</Translate>
              </Link>
              <Translate contentKey="global.messages.info.authenticated.suffix">
                , you can try the default accounts:
                <br />- Administrator (login=&quot;admin&quot; and password=&quot;admin&quot;)
                <br />- User (login=&quot;user&quot; and password=&quot;user&quot;).
              </Translate>
            </Alert>

           
          </div>
        )}
        
      </Col>
      <Col md="3" className="pad">
        <span className="hipster rounded" />
      </Col>
    </Row>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);
