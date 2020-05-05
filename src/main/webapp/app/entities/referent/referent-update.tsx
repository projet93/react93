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
import { getEntity, updateEntity, createEntity, reset } from './referent.reducer';
import { IReferent } from 'app/shared/model/referent.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IReferentUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ReferentUpdate = (props: IReferentUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { referentEntity, users, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/referent' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getUsers();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...referentEntity,
        ...values
      };
      entity.user = users[values.user];

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="react93App.referent.home.createOrEditLabel">
            <Translate contentKey="react93App.referent.home.createOrEditLabel">Create or edit a Referent</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : referentEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="referent-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="referent-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nomLabel" for="referent-nom">
                  <Translate contentKey="react93App.referent.nom">Nom</Translate>
                </Label>
                <AvField id="referent-nom" type="text" name="nom" />
              </AvGroup>
              <AvGroup>
                <Label id="prenomLabel" for="referent-prenom">
                  <Translate contentKey="react93App.referent.prenom">Prenom</Translate>
                </Label>
                <AvField id="referent-prenom" type="text" name="prenom" />
              </AvGroup>
              <AvGroup>
                <Label id="licenceLabel" for="referent-licence">
                  <Translate contentKey="react93App.referent.licence">Licence</Translate>
                </Label>
                <AvField id="referent-licence" type="text" name="licence" />
              </AvGroup>
              <AvGroup>
                <Label id="telephoneLabel" for="referent-telephone">
                  <Translate contentKey="react93App.referent.telephone">Telephone</Translate>
                </Label>
                <AvField id="referent-telephone" type="text" name="telephone" />
              </AvGroup>
              <AvGroup>
                <Label id="emailLabel" for="referent-email">
                  <Translate contentKey="react93App.referent.email">Email</Translate>
                </Label>
                <AvField id="referent-email" type="text" name="email" />
              </AvGroup>
              
              <Button tag={Link} id="cancel-save" to="/referent" replace color="info">
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
  referentEntity: storeState.referent.entity,
  loading: storeState.referent.loading,
  updating: storeState.referent.updating,
  updateSuccess: storeState.referent.updateSuccess
});

const mapDispatchToProps = {
  getUsers,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ReferentUpdate);
