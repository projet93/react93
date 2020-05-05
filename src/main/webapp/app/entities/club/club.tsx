import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import {
  openFile,
  byteSize,
  Translate,
  translate,
  getSortState,
  JhiPagination,
  JhiItemCount
} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities } from './club.reducer';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface IClubProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> { }

export const Club = (props: IClubProps) => {
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

  const { clubList, match, loading, totalItems } = props;
  return (
    <div>
      <Row>
        <Col sm="7">
          <h2 id="club-heading">
            <Translate contentKey="react93App.club.home.title">Clubs</Translate>
          </h2>
        </Col>
        <Col sm="5">

          <AvForm onSubmit={startSearching}>
              <InputGroup className="w-100 mr-1">
              <AvInput
                
                type="text"
                name="search"
                value={search}
                onChange={handleSearch}
                placeholder={translate('react93App.club.home.search')}
              />
              <AvGroup>
              <Button className="input-group-addon">
                <FontAwesomeIcon icon="search" />
              </Button>
              {
                  search !== '' &&                
                <Button type="reset" className="input-group-addon" onClick={clear}>
                  <FontAwesomeIcon icon="trash" />
                </Button>
                }
                <Link to={`${match.url}/new`} className="btn btn-primary create-entity" id="jh-create-entity">
                  <FontAwesomeIcon icon="plus" />
              &nbsp;
              <Translate contentKey="react93App.club.home.createLabel">Create new Club</Translate>
                </Link>

              
            </AvGroup>
            </InputGroup>
          </AvForm>
        </Col>
      </Row>
      <div className="table-responsive">
        {clubList && clubList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('logo')}>
                  <Translate contentKey="react93App.club.logo">Logo</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nom')}>
                  <Translate contentKey="react93App.club.nom">Nom</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('adresse')}>
                  <Translate contentKey="react93App.club.adresse">Adresse</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('telephone')}>
                  <Translate contentKey="react93App.club.telephone">Telephone</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('email')}>
                  <Translate contentKey="react93App.club.email">Email</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {clubList.map((club, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${club.id}`} color="link" size="sm">
                      {club.id}
                    </Button>
                  </td>
                  <td>
                    {club.logo ? (
                      <div>
                        <a onClick={openFile(club.logoContentType, club.logo)}>
                          <Translate contentKey="entity.action.open">Open</Translate>
                          &nbsp;
                        </a>
                        <span>
                          {club.logoContentType}, {byteSize(club.logo)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td>{club.nom}</td>
                  <td>{club.adresse}</td>
                  <td>{club.telephone}</td>
                  <td>{club.email}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${club.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${club.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${club.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="danger"
                        size="sm"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
            !loading && (
              <div className="alert alert-warning">
                <Translate contentKey="react93App.club.home.notFound">No Clubs found</Translate>
              </div>
            )
          )}
      </div>
      <div className={clubList && clubList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ club }: IRootState) => ({
  clubList: club.entities,
  loading: club.loading,
  totalItems: club.totalItems
});

const mapDispatchToProps = {
  getSearchEntities,
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Club);
