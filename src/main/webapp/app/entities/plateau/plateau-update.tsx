import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, ICrudGetAllAction, setFileData, openFile, byteSize, ICrudPutAction, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IReferent } from 'app/shared/model/referent.model';
import { getEntities as getReferents } from 'app/entities/referent/referent.reducer';
import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { IStade } from 'app/shared/model/stade.model';
import { getEntities as getStades } from 'app/entities/stade/stade.reducer';
import { ICategorie } from 'app/shared/model/categorie.model';
import { getEntities as getCategories } from 'app/entities/categorie/categorie.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './plateau.reducer';
import { IPlateau } from 'app/shared/model/plateau.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IPlateauUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> { }

export interface IPlateauUpdateState {
  isNew: boolean;
  referentId: string;
  userId: string;
  stadeId: string;
  categorieId: string;
}

export class PlateauUpdate extends React.Component<IPlateauUpdateProps, IPlateauUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      referentId: '0',
      userId: '0',
      stadeId: '0',
      categorieId: '0',
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getReferents();
    this.props.getUsers();
    this.props.getStades();
    this.props.getCategories();
  }

  onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => this.props.setBlob(name, data, contentType), isAnImage);
  };

  clearBlob = name => () => {
    this.props.setBlob(name, undefined, undefined);
  };

  saveEntity = (event, errors, values) => {
    values.dateDebut = convertDateTimeToServer(values.dateDebut);
    values.dateFin = convertDateTimeToServer(values.dateFin);

    if (errors.length === 0) {
      const { plateauEntity } = this.props;
      const entity = {
        ...plateauEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/plateau');
  };

  render() {
    const { plateauEntity, referents, users, stades, categories, loading, updating } = this.props;
    const { isNew } = this.state;

    const { programme, programmeContentType } = plateauEntity;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="react93App.plateau.home.createOrEditLabel">
              <Translate contentKey="react93App.plateau.home.createOrEditLabel">Create or edit a Plateau</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
                <AvForm model={isNew ? {} : plateauEntity} onSubmit={this.saveEntity}>
                  {!isNew ? (
                    <AvGroup>
                      <Label for="plateau-id">
                        <Translate contentKey="global.field.id">ID</Translate>
                      </Label>
                      <AvInput id="plateau-id" type="text" className="form-control" name="id" required readOnly />
                    </AvGroup>
                  ) : null}
                  <Row>
                    <Col md="6">
                      <AvGroup>
                        <Label id="dateDebutLabel" for="plateau-dateDebut">
                          <Translate contentKey="react93App.plateau.dateDebut">Date Debut</Translate>
                        </Label>
                        <br />
                        {
                          <AvInput
                            id="plateau-dateDebut"
                            type="datetime-local"
                            className="form-control"
                            name="dateDebut"
                            placeholder={'YYYY-MM-DD HH:mm'}
                            value={isNew ? null : convertDateTimeFromServer(this.props.plateauEntity.dateDebut)}
                            validate={{
                              required: { value: true, errorMessage: 'This field is required.' }
                            }}
                          />
                        }

                      </AvGroup>
                    </Col>
                    <Col md="6">
                      <AvGroup>
                        <Label id="dateFinLabel" for="plateau-dateFin">
                          <Translate contentKey="react93App.plateau.dateFin">Date Fin</Translate>
                        </Label>
                        <br />
                        <AvInput
                          id="plateau-dateFin"
                          type="datetime-local"
                          className="form-control"
                          name="dateFin"
                          placeholder={'YYYY-MM-DD HH:mm'}
                          value={isNew ? null : convertDateTimeFromServer(this.props.plateauEntity.dateFin)}
                        />
                       
                      </AvGroup>
                    </Col>
                  </Row>
                  <AvGroup>
                    <AvGroup>
                      <Label id="programmeLabel" for="programme">
                        <Translate contentKey="react93App.plateau.programme">Programme</Translate>
                      </Label>
                      <br />
                      {programme ? (
                        <div>
                          <a onClick={openFile(programmeContentType, programme)}>
                            <Translate contentKey="entity.action.open">Open</Translate>
                          </a>
                          <br />
                          <Row>
                            <Col md="11">
                              <span>
                                {programmeContentType}, {byteSize(programme)}
                              </span>
                            </Col>
                            <Col md="1">
                              <Button color="danger" onClick={this.clearBlob('programme')}>
                                <FontAwesomeIcon icon="times-circle" />
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      ) : null}
                      <input id="file_programme" type="file" onChange={this.onBlobChange(false, 'programme')} />
                      <AvInput type="hidden" name="programme" value={programme} />
                    </AvGroup>
                  </AvGroup>
                  <Row>
                    <Col md="4">
                      <AvGroup>
                        <Label id="nombreEquipeMaxLabel" for="plateau-nombreEquipeMax">
                          <Translate contentKey="react93App.plateau.nombreEquipeMax">Nombre Equipe Max</Translate>
                        </Label>
                        <AvField id="plateau-nombreEquipeMax" type="string" className="form-control" name="nombreEquipeMax" required />
                      </AvGroup>
                    </Col>
                    <Col md="4">

                      <AvGroup>
                        <Label id="nombreEquipeLabel" for="plateau-nombreEquipe">
                          <Translate contentKey="react93App.plateau.nombreEquipe">Nombre Equipe</Translate>
                        </Label>
                        {!isNew ?
                          (<AvField id="plateau-nombreEquipe" type="string" className="form-control" name="nombreEquipe" readOnly />)
                          :
                          (<AvField id="plateau-nombreEquipe" type="string" className="form-control" name="nombreEquipe" />)
                        }
                      </AvGroup>

                    </Col>
                    <Col md="4">
                      <AvGroup>
                        <Label for="plateau-referent">
                          <Translate contentKey="react93App.plateau.referent">Referent</Translate>
                        </Label>
                        <AvInput id="plateau-referent" type="select" className="form-control" name="referent.id">
                          <option value="" key="0" />
                          {referents
                            ? referents.map(otherEntity => (
                              <option value={otherEntity.id} key={otherEntity.id}>
                                {otherEntity.nom}
                              </option>
                            ))
                            : null}
                        </AvInput>
                      </AvGroup>
                    </Col>
                  </Row>
                  <AvGroup>
                    <Label for="plateau-stade">
                      <Translate contentKey="react93App.plateau.stade">Stade</Translate>
                    </Label>
                    <AvInput id="plateau-stade" type="select" className="form-control" name="stade.id">
                      <option value="" key="0" />
                      {stades
                        ? stades.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.nom}
                          </option>
                        ))
                        : null}
                    </AvInput>
                  </AvGroup>
                  <AvGroup>
                    <Label for="plateau-categorie">
                      <Translate contentKey="react93App.plateau.categorie">Categorie</Translate>
                    </Label>
                    <AvInput id="plateau-categorie" type="select" className="form-control" name="categorie.id">
                      <option value="" key="0" />
                      {categories
                        ? categories.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.section}
                          </option>
                        ))
                        : null}
                    </AvInput>
                  </AvGroup>
                  <Button tag={Link} id="cancel-save" to="/plateau" replace color="info">
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
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  referents: storeState.referent.entities,
  users: storeState.userManagement.users,
  stades: storeState.stade.entities,
  categories: storeState.categorie.entities,
  plateauEntity: storeState.plateau.entity,
  loading: storeState.plateau.loading,
  updating: storeState.plateau.updating,
  updateSuccess: storeState.plateau.updateSuccess
});

const mapDispatchToProps = {
  getReferents,
  getUsers,
  getStades,
  getCategories,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlateauUpdate);
