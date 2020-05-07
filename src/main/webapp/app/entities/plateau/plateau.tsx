import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Label, Col, Row, Table } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Switch } from '@material-ui/core';



import {
  openFile,
  byteSize,
  Translate,
  translate,
  TextFormat,
  getSortState,
  JhiPagination,
  JhiItemCount
} from 'react-jhipster';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities, updateEntity } from './plateau.reducer';
import { APP_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface IPlateauProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> { }

export const Plateau = (props: IPlateauProps) => {
  const [search, setSearch] = useState('');
  const [paginationState, setPaginationState] = useState(getSortState(props.location, ITEMS_PER_PAGE));

  const getAllEntities = () => {
    if (search) {
      props.getSearchEntities(
        search,
        paginationState.activePage - 1,
        paginationState.itemsPerPage,
        `${paginationState.sort},${paginationState.order}`
      );
    } else {
      props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
    }
  };

  const startSearching = () => {
    if (search) {
      setPaginationState({
        ...paginationState,
        activePage: 1
      });
      props.getSearchEntities(
        search,
        paginationState.activePage - 1,
        paginationState.itemsPerPage,
        `${paginationState.sort},${paginationState.order}`
      );
    }
  };

  const clear = () => {
    setSearch('');
    setPaginationState({
      ...paginationState,
      activePage: 1
    });
    props.getEntities();
  };

  const handleSearch = event => setSearch(event.target.value);

  const sortEntities = () => {
    getAllEntities();
    props.history.push(
      `${props.location.pathname}?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`
    );
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort, search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === 'asc' ? 'desc' : 'asc',
      sort: p
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage
    });
  const toggleActive = plateauEntity => () =>
    props.updateEntity({
      ...plateauEntity,
      valid: !plateauEntity.valid
    });

  const { plateauList, match, loading, totalItems } = props;
  const isAdmin: boolean = (localStorage.getItem('isAdmin') === 'true');
  const login: string = localStorage.getItem('login');

  const inscription = plateauEntity => () => {
    localStorage.setItem('plateauId', plateauEntity.id);
    props.history.push('/inscription/new');
  }

  function isInscription(plateauEntity) {
    let result = true;
    if (isAdmin) {
      return false;
    }
    if (!isAdmin && login === plateauEntity.user.login) {
      return false;
    }
    if (!isAdmin && login !== plateauEntity.user.login) {
      plateauEntity.inscriptions.find(function (value) {
        const loginValue = 'club' + value.club.id;
        if (plateauEntity.id === value.plateau.id && loginValue === login)
          result = false;
      });
    }
    return result;
  };



  return (
    <div>
      <Row>
        <Col sm="7">
          <h2 id="plateau-heading">
            <Translate contentKey="react93App.plateau.home.title">Plateaus</Translate>
          </h2>
        </Col>
        <Col sm="5">
          <AvForm onSubmit={startSearching}>
            <AvGroup>
              <InputGroup>
                <AvInput
                  type="text"
                  name="search"
                  value={search}
                  onChange={handleSearch}
                  placeholder={translate('react93App.plateau.home.search')}
                />
                <Button className="input-group-addon">
                  <FontAwesomeIcon icon="search" />
                </Button>
                {
                  search !== '' &&
                  <Button type="reset" className="input-group-addon" onClick={clear}>
                    <FontAwesomeIcon icon="trash" />
                  </Button>
                }
                <Link to={`${match.url}/new`} className="btn btn-primary float-right create-entity" id="jh-create-entity">
                  <FontAwesomeIcon icon="plus" />&nbsp;
                  <Translate contentKey="react93App.plateau.home.createLabel">Create new Plateau</Translate>
                </Link>
              </InputGroup>
            </AvGroup>
          </AvForm>
        </Col>
      </Row>

      <div className="table-responsive">
        {plateauList && plateauList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dateDebut')}>
                  <Translate contentKey="react93App.plateau.dateDebut">Date Debut</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dateFin')}>
                  <Translate contentKey="react93App.plateau.dateFin">Date Fin</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('programme')}>
                  <Translate contentKey="react93App.plateau.programme">Programme</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nombreEquipeMax')}>
                  <Translate contentKey="react93App.plateau.nombreEquipeMax">Nombre Equipe Max</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nombreEquipe')}>
                  <Translate contentKey="react93App.plateau.nombreEquipe">Nombre Equipe</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('statut')}>
                  <Translate contentKey="react93App.plateau.statut">Statut</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="react93App.plateau.stade">Stade</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="react93App.plateau.categorie">Categorie</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {plateauList.map((plateau, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${plateau.id}`} color="link" size="sm">
                      {plateau.id}
                    </Button>
                  </td>
                  <td>
                    <TextFormat type="date" value={plateau.dateDebut} format={APP_DATE_FORMAT} />
                  </td>
                  <td>
                    <TextFormat type="date" value={plateau.dateFin} format={APP_DATE_FORMAT} />
                  </td>
                  <td>
                    {plateau.programme ? (
                      <div>
                        <a onClick={openFile(plateau.programmeContentType, plateau.programme)}>
                          <Translate contentKey="entity.action.open">Open</Translate>
                          &nbsp;
                          <FontAwesomeIcon icon="book" />
                        </a>

                      </div>
                    ) : null}
                  </td>
                  <td className="text-center">{plateau.nombreEquipeMax}</td>
                  <td className="text-center">{plateau.nombreEquipe}</td>
                  <td>
                    <Translate contentKey={`react93App.Statut.${plateau.statut}`} />
                  </td>

                  <td>{plateau.stade ? <Link to={`stade/${plateau.stade.id}`}>{plateau.stade.nom}</Link> : ''}</td>
                  <td className="text-center">{plateau.categorie ? <Link to={`categorie/${plateau.categorie.id}`}>{plateau.categorie.section}</Link> : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">

                      {!isAdmin && login === plateau.user.login &&
                        <Button tag={Link} to={`${match.url}/${plateau.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" />

                        </Button>}
                      {!isAdmin && login === plateau.user.login &&
                        <Button
                          tag={Link}
                          to={`${match.url}/${plateau.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                          color="primary"
                          size="sm">
                          <FontAwesomeIcon icon="pencil-alt" />

                        </Button>
                      }
                      {!isAdmin && login !== plateau.user.login &&
                        <Button tag={Link} to={`${match.url}/${plateau.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" />

                        </Button>
                      }
                      {isInscription(plateau) &&
                        <Button
                          tag={Link}
                          onClick={inscription(plateau)}
                          color="primary"
                          size="sm">
                          <FontAwesomeIcon icon="plus" />
                        </Button>
                      }

                      {!isAdmin && login === plateau.user.login &&
                        <Button
                          tag={Link}
                          to={`${match.url}/${plateau.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                          color="danger"
                          size="sm">
                          <FontAwesomeIcon icon="trash" />
                        </Button>
                      }

                      {isAdmin  && (
                        <FormControlLabel
                      control={<Switch checked={plateau.valid} onChange={toggleActive(plateau)} name="checkedB" />}
                      label="Activited"
                    />
                      )}
                      

                    </div>
                   
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
            !loading && (
              <div className="alert alert-warning">
                <Translate contentKey="react93App.plateau.home.notFound">No Plateaus found</Translate>
              </div>
            )
          )}
      </div>
      <div className={plateauList && plateauList.length > 0 ? '' : 'd-none'}>
        <Row className="justify-content-center">
          <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
        </Row>
        <Row className="justify-content-center">
          <JhiPagination
            activePage={paginationState.activePage}
            onSelect={handlePagination}
            maxButtons={5}
            itemsPerPage={paginationState.itemsPerPage}
            totalItems={props.totalItems}
          />
        </Row>
      </div>
    </div>
  );
};

const mapStateToProps = ({ plateau }: IRootState) => ({
  plateauList: plateau.entities,
  loading: plateau.loading,
  totalItems: plateau.totalItems
});

const mapDispatchToProps = {
  getSearchEntities,
  getEntities,
  updateEntity
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Plateau);
