import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Table } from 'reactstrap';
import { Translate, openFile, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './plateau.reducer';
import { APP_DATE_FORMAT } from 'app/config/constants';

export interface IPlateauDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> { }

export const PlateauDetail = (props: IPlateauDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  function activetedButton(inscriptionEntity) {
    const loginValue = 'club' + inscriptionEntity.club.id;
    if (loginValue === localStorage.getItem('login'))
      return true;
    return false;

  };

  const { plateauEntity, match } = props;

  return (
    <Row>
      <Col md="4">
        <h2>
          <Translate contentKey="react93App.plateau.detail.title">Plateau</Translate> [<b>{plateauEntity.id}</b>] [{plateauEntity.statut}]
        </h2>
        <dl className="row">
          <dt className="col-sm-5">
            <span id="dateDebut">
              <Translate contentKey="react93App.plateau.dateDebut">Date Debut</Translate>
            </span>
          </dt>
          <dd className="col-sm-7">
            <TextFormat value={plateauEntity.dateDebut} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt className="col-sm-5">
            <span id="dateFin">
              <Translate contentKey="react93App.plateau.dateFin">Date Fin</Translate>
            </span>
          </dt>
          <dd className="col-sm-7">
            <TextFormat value={plateauEntity.dateFin} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt className="col-sm-5">
            <span id="programme">
              <Translate contentKey="react93App.plateau.programme">Programme</Translate>
            </span>
          </dt>
          <dd className="col-sm-7">
            {plateauEntity.programme ? (
              <div>
                <a onClick={openFile(plateauEntity.programmeContentType, plateauEntity.programme)}>
                  <Translate contentKey="entity.action.open">Open</Translate>&nbsp;
                </a>
                <span>
                  {plateauEntity.programmeContentType}, {byteSize(plateauEntity.programme)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt className="col-sm-5">
            <span id="nombreEquipeMax">
              <Translate contentKey="react93App.plateau.nombreEquipeMax">Nombre Equipe Max</Translate>
            </span>
          </dt>
          <dd className="col-sm-7">{plateauEntity.nombreEquipeMax}</dd>
          <dt className="col-sm-5">
            <span id="nombreEquipe">
              <Translate contentKey="react93App.plateau.nombreParticipant">Nombre Participant</Translate>
            </span>
          </dt>
          <dd className="col-sm-7">{plateauEntity.nombreEquipe}</dd>



          <dt className="col-sm-5">
            <Translate contentKey="react93App.plateau.referent">Referent</Translate>
          </dt>
          <dd className="col-sm-7">{plateauEntity.referent ? plateauEntity.referent.nom : ''}</dd>
          <dt className="col-sm-5">
            <Translate contentKey="react93App.inscription.club">Club</Translate>
          </dt>
          <dd className="col-sm-7">{plateauEntity.user ? plateauEntity.user.firstName + ' [' + plateauEntity.user.login + ']' : ''}</dd>
          <dt className="col-sm-5">
            <Translate contentKey="react93App.plateau.stade">Stade</Translate>
          </dt>
          <dd className="col-sm-7">{plateauEntity.stade ? plateauEntity.stade.nom : ''}</dd>
          <dt className="col-sm-5">
            <Translate contentKey="react93App.plateau.categorie">Categorie</Translate>
          </dt>
          <dd className="col-sm-7">{plateauEntity.categorie ? plateauEntity.categorie.section : ''}</dd>
        </dl>        
        <Button tag={Link} to="/plateau" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/plateau/${plateauEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
      <Col md="8">
        <div>
          <h2 id="inscription-heading">
            <Translate contentKey="react93App.inscription.home.title">Inscriptions</Translate>
          </h2>

          <div className="table-responsive">
            {plateauEntity.inscriptions && plateauEntity.inscriptions.length > 0 ? (
              <Table responsive>
                <thead>
                  <tr>
                    <th>
                      <Translate contentKey="global.field.id">ID</Translate>
                    </th>
                    <th>
                      <Translate contentKey="react93App.inscription.nombreEquipe">Nombre Equipe</Translate>
                    </th>

                    <th>
                      <Translate contentKey="react93App.inscription.club">Club</Translate>
                    </th>
                    <th>
                      <Translate contentKey="react93App.inscription.referent">Referent</Translate>
                    </th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {plateauEntity.inscriptions.map((inscription, i) => (
                    <tr key={`entity-${i}`}>
                      <td>
                        <Button tag={Link} to={`${match.url}/${inscription.id}`} color="link" size="sm">
                          {inscription.id}
                        </Button>
                      </td>
                      <td>{inscription.nombreEquipe}</td>
                      <td>{inscription.club ? <Link to={`club/${inscription.club.id}`}>{inscription.club.nom}</Link> : ''}</td>
                      <td>{inscription.referent ? <Link to={`referent/${inscription.referent.id}`}>{inscription.referent.nom}</Link> : ''}</td>
                      <td className="text-right">
                        {activetedButton(inscription) &&
                        <div className="btn-group flex-btn-group-container">
                          <Button tag={Link} to={`${match.url}/${inscription.id}`} color="info" size="sm">
                            <FontAwesomeIcon icon="eye" />
                          </Button>
                          <Button tag={Link} to={`/inscription/${inscription.id}/edit`} color="primary" size="sm">
                            <FontAwesomeIcon icon="pencil-alt" />
                          </Button>
                          <Button tag={Link} to={`/inscription/${inscription.id}/delete`} color="danger" size="sm">
                            <FontAwesomeIcon icon="trash" />

                          </Button>
                        </div>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (

                <div className="alert alert-warning">
                  <Translate contentKey="react93App.inscription.home.notFound">No Inscriptions found</Translate>
                </div>
              )}
          </div>
        </div>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ plateau }: IRootState) => ({
  plateauEntity: plateau.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PlateauDetail);
