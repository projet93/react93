import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './inscription.reducer';
import { IInscription } from 'app/shared/model/inscription.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IInscriptionDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const InscriptionDetail = (props: IInscriptionDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { inscriptionEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="react93App.inscription.detail.title">Inscription</Translate> [<b>{inscriptionEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="nombreEquipe">
              <Translate contentKey="react93App.inscription.nombreEquipe">Nombre Equipe</Translate>
            </span>
          </dt>
          <dd>{inscriptionEntity.nombreEquipe}</dd>
          <dt>
            <Translate contentKey="react93App.inscription.plateau">Plateau</Translate>
          </dt>
          <dd>{inscriptionEntity.plateau ? inscriptionEntity.plateau.id : ''}</dd>
          <dt>
            <Translate contentKey="react93App.inscription.club">Club</Translate>
          </dt>
          <dd>{inscriptionEntity.club ? inscriptionEntity.club.nom : ''}</dd>
          <dt>
            <Translate contentKey="react93App.inscription.referent">Referent</Translate>
          </dt>
          <dd>{inscriptionEntity.referent ? inscriptionEntity.referent.nom : ''}</dd>
        </dl>
        <Button tag={Link} to="/inscription" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/inscription/${inscriptionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ inscription }: IRootState) => ({
  inscriptionEntity: inscription.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(InscriptionDetail);
