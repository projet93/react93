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
import { getEntity, updateEntity, createEntity, reset } from './categorie.reducer';
import { ICategorie } from 'app/shared/model/categorie.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ICategorieUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const CategorieUpdate = (props: ICategorieUpdateProps) => {
  const [userId, setUserId] = useState('0');
  const [clubId, setClubId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { categorieEntity, users, clubs, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/categorie');
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
        ...categorieEntity,
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
          <h2 id="react93App.categorie.home.createOrEditLabel">
            <Translate contentKey="react93App.categorie.home.createOrEditLabel">Create or edit a Categorie</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : categorieEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="categorie-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="categorie-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="sectionLabel" for="categorie-section">
                  <Translate contentKey="react93App.categorie.section">Section</Translate>
                </Label>
                <AvInput
                  id="categorie-section"
                  type="select"
                  className="form-control"
                  name="section"
                  value={(!isNew && categorieEntity.section) || 'U6'}
                >
                  <option value="U6">{translate('react93App.Section.U6')}</option>
                  <option value="U7">{translate('react93App.Section.U7')}</option>
                  <option value="U8">{translate('react93App.Section.U8')}</option>
                  <option value="U9">{translate('react93App.Section.U9')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="descritionLabel" for="categorie-descrition">
                  <Translate contentKey="react93App.categorie.descrition">Descrition</Translate>
                </Label>
                <AvField id="categorie-descrition" type="text" name="descrition" />
              </AvGroup>
              
              <Button tag={Link} id="cancel-save" to="/categorie" replace color="info">
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
  categorieEntity: storeState.categorie.entity,
  loading: storeState.categorie.loading,
  updating: storeState.categorie.updating,
  updateSuccess: storeState.categorie.updateSuccess
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

export default connect(mapStateToProps, mapDispatchToProps)(CategorieUpdate);
