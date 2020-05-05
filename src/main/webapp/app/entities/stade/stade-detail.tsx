import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './stade.reducer';
import { IStade } from 'app/shared/model/stade.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IStadeDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const StadeDetail = (props: IStadeDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { stadeEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="react93App.stade.detail.title">Stade</Translate> [<b>{stadeEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="nom">
              <Translate contentKey="react93App.stade.nom">Nom</Translate>
            </span>
          </dt>
          <dd>{stadeEntity.nom}</dd>
          <dt>
            <span id="adresse">
              <Translate contentKey="react93App.stade.adresse">Adresse</Translate>
            </span>
          </dt>
          <dd>{stadeEntity.adresse}</dd>
          <dt>
            <span id="codePostal">
              <Translate contentKey="react93App.stade.codePostal">Code Postal</Translate>
            </span>
          </dt>
          <dd>{stadeEntity.codePostal}</dd>
          <dt>
            <span id="ville">
              <Translate contentKey="react93App.stade.ville">Ville</Translate>
            </span>
          </dt>
          <dd>{stadeEntity.ville}</dd>
          <dt>
            <Translate contentKey="react93App.stade.user">User</Translate>
          </dt>
          <dd>{stadeEntity.user ? stadeEntity.user.id : ''}</dd>
          <dt>
            <Translate contentKey="react93App.stade.club">Club</Translate>
          </dt>
          <dd>{stadeEntity.club ? stadeEntity.club.nom : ''}</dd>
        </dl>
        <Button tag={Link} to="/stade" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/stade/${stadeEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ stade }: IRootState) => ({
  stadeEntity: stade.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(StadeDetail);
