import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, openFile, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { ICategorie } from 'app/shared/model/categorie.model';
import { getEntities as getCategories } from 'app/entities/categorie/categorie.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './club.reducer';
import { IClub } from 'app/shared/model/club.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IClubUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ClubUpdate = (props: IClubUpdateProps) => {
  const [idscategorie, setIdscategorie] = useState([]);
  const [userId, setUserId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { clubEntity, users, categories, loading, updating } = props;

  const { logo, logoContentType } = clubEntity;

  const handleClose = () => {
    props.history.push('/club' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getUsers();
    props.getCategories();
  }, []);

  const onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => props.setBlob(name, data, contentType), isAnImage);
  };

  const clearBlob = name => () => {
    props.setBlob(name, undefined, undefined);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...clubEntity,
        ...values,
        categories: mapIdList(values.categories)
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
          <h2 id="react93App.club.home.createOrEditLabel">
            <Translate contentKey="react93App.club.home.createOrEditLabel">Create or edit a Club</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : clubEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="club-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="club-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <AvGroup>
                  <Label id="logoLabel" for="logo">
                    <Translate contentKey="react93App.club.logo">Logo</Translate>
                  </Label>
                  <br />
                  {logo ? (
                    <div>
                      <a onClick={openFile(logoContentType, logo)}>
                        <Translate contentKey="entity.action.open">Open</Translate>
                      </a>
                      <br />
                      <Row>
                        <Col md="11">
                          <span>
                            {logoContentType}, {byteSize(logo)}
                          </span>
                        </Col>
                        <Col md="1">
                          <Button color="danger" onClick={clearBlob('logo')}>
                            <FontAwesomeIcon icon="times-circle" />
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ) : null}
                  <input id="file_logo" type="file" onChange={onBlobChange(false, 'logo')} />
                  <AvInput type="hidden" name="logo" value={logo} />
                </AvGroup>
              </AvGroup>
              <AvGroup>
                <Label id="nomLabel" for="club-nom">
                  <Translate contentKey="react93App.club.nom">Nom</Translate>
                </Label>
                <AvField
                  id="club-nom"
                  type="text"
                  name="nom"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="adresseLabel" for="club-adresse">
                  <Translate contentKey="react93App.club.adresse">Adresse</Translate>
                </Label>
                <AvField id="club-adresse" type="text" name="adresse" />
              </AvGroup>
              <AvGroup>
                <Label id="telephoneLabel" for="club-telephone">
                  <Translate contentKey="react93App.club.telephone">Telephone</Translate>
                </Label>
                <AvField id="club-telephone" type="text" name="telephone" />
              </AvGroup>
              <AvGroup>
                <Label id="emailLabel" for="club-email">
                  <Translate contentKey="react93App.club.email">Email</Translate>
                </Label>
                <AvField
                  id="club-email"
                  type="text"
                  name="email"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') }
                  }}
                />
              </AvGroup>
              
              <AvGroup>
                <Label for="club-categorie">
                  <Translate contentKey="react93App.club.categorie">Categorie</Translate>
                </Label>
                <AvInput
                  id="club-categorie"
                  type="select"
                  multiple
                  className="form-control"
                  name="categories"
                  value={clubEntity.categories && clubEntity.categories.map(e => e.id)}
                >
                  {categories
                    ? categories.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.section}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/club" replace color="info">
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
  categories: storeState.categorie.entities,
  clubEntity: storeState.club.entity,
  loading: storeState.club.loading,
  updating: storeState.club.updating,
  updateSuccess: storeState.club.updateSuccess
});

const mapDispatchToProps = {
  getUsers,
  getCategories,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ClubUpdate);
