import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './referent.reducer';
import { IReferent } from 'app/shared/model/referent.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IReferentDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ReferentDetail = (props: IReferentDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { referentEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="react93App.referent.detail.title">Referent</Translate> [<b>{referentEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="nom">
              <Translate contentKey="react93App.referent.nom">Nom</Translate>
            </span>
          </dt>
          <dd>{referentEntity.nom}</dd>
          <dt>
            <span id="prenom">
              <Translate contentKey="react93App.referent.prenom">Prenom</Translate>
            </span>
          </dt>
          <dd>{referentEntity.prenom}</dd>
          <dt>
            <span id="licence">
              <Translate contentKey="react93App.referent.licence">Licence</Translate>
            </span>
          </dt>
          <dd>{referentEntity.licence}</dd>
          <dt>
            <span id="telephone">
              <Translate contentKey="react93App.referent.telephone">Telephone</Translate>
            </span>
          </dt>
          <dd>{referentEntity.telephone}</dd>
          <dt>
            <span id="email">
              <Translate contentKey="react93App.referent.email">Email</Translate>
            </span>
          </dt>
          <dd>{referentEntity.email}</dd>
          <dt>
            <Translate contentKey="react93App.referent.user">User</Translate>
          </dt>
          <dd>{referentEntity.user ? referentEntity.user.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/referent" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/referent/${referentEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ referent }: IRootState) => ({
  referentEntity: referent.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ReferentDetail);
