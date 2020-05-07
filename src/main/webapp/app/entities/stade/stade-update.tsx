import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { IClub } from 'app/shared/model/club.model';
import { getEntities as getClubs } from 'app/entities/club/club.reducer';
import { getEntity, updateEntity, createEntity, reset } from './stade.reducer';
import { IStade } from 'app/shared/model/stade.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IStadeUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const StadeUpdate = (props: IStadeUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [clubId, setClubId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { stadeEntity, users, clubs, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/stade' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getUsers();
    props.getClubs();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...stadeEntity,
        ...values
      };
      entity.user = users[values.user];

      if (isNew) {
        props.createEntity(entity);
      } else {
        entity.user = stadeEntity.user;
        entity.club = stadeEntity.club;
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="react93App.stade.home.createOrEditLabel">
            <Translate contentKey="react93App.stade.home.createOrEditLabel">Create or edit a Stade</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : stadeEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="stade-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="stade-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nomLabel" for="stade-nom">
                  <Translate contentKey="react93App.stade.nom">Nom</Translate>
                </Label>
                <AvField
                  id="stade-nom"
                  type="text"
                  name="nom"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') }
                  }}
                />
              </AvGroup>

              <AvGroup>
                <Label id="adresseLabel" for="stade-adresse">
                  <Translate contentKey="react93App.stade.adresse">Adresse</Translate>
                </Label>
                <AvField id="stade-adresse" type="text" name="adresse" />
              </AvGroup>
              <AvGroup>
                <Label id="codePostalLabel" for="stade-codePostal">
                  <Translate contentKey="react93App.stade.codePostal">Code Postal</Translate>
                </Label>
                <AvField id="stade-codePostal" type="text" name="codePostal" />
              </AvGroup>
              <AvGroup>
                <Label id="villeLabel" for="stade-ville">
                  <Translate contentKey="react93App.stade.ville">Ville</Translate>
                </Label>
                <AvField id="stade-ville" type="text" name="ville" />
              </AvGroup>
             
              <Button tag={Link} id="cancel-save" to="/stade" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  users: storeState.userManagement.users,
  clubs: storeState.club.entities,
  stadeEntity: storeState.stade.entity,
  loading: storeState.stade.loading,
  updating: storeState.stade.updating,
  updateSuccess: storeState.stade.updateSuccess
});

const mapDispatchToProps = {
  getUsers,
  getClubs,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(StadeUpdate);
