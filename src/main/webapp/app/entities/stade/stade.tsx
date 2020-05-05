import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import {
  Translate,
  translate,
  ICrudSearchAction,
  ICrudGetAllAction,
  getSortState,
  IPaginationBaseState,
  JhiPagination,
  JhiItemCount
} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities } from './stade.reducer';
import { IStade } from 'app/shared/model/stade.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface IStadeProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> { }

export const Stade = (props: IStadeProps) => {
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

  const { stadeList, match, loading, totalItems } = props;
  return (
    <div>
      <Row>
        <Col sm="7">
          <h2 id="stade-heading">
            <Translate contentKey="react93App.stade.home.title">Stades</Translate>
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
                  placeholder={translate('react93App.stade.home.search')}
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
                  <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="react93App.stade.home.createLabel">Create new Stade</Translate>
                </Link>
              </InputGroup>
            </AvGroup>
          </AvForm>
        </Col>
      </Row>
      <div className="table-responsive">
        {stadeList && stadeList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nom')}>
                  <Translate contentKey="react93App.stade.nom">Nom</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('adresse')}>
                  <Translate contentKey="react93App.stade.adresse">Adresse</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('codePostal')}>
                  <Translate contentKey="react93App.stade.codePostal">Code Postal</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('ville')}>
                  <Translate contentKey="react93App.stade.ville">Ville</Translate> <FontAwesomeIcon icon="sort" />
                </th>

                <th />
              </tr>
            </thead>
            <tbody>
              {stadeList.map((stade, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${stade.id}`} color="link" size="sm">
                      {stade.id}
                    </Button>
                  </td>
                  <td>{stade.nom}</td>
                  <td>{stade.adresse}</td>
                  <td>{stade.codePostal}</td>
                  <td>{stade.ville}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${stade.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${stade.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`${match.url}/${stade.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                <Translate contentKey="react93App.stade.home.notFound">No Stades found</Translate>
              </div>
            )
          )}
      </div>
      <div className={stadeList && stadeList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ stade }: IRootState) => ({
  stadeList: stade.entities,
  loading: stade.loading,
  totalItems: stade.totalItems
});

const mapDispatchToProps = {
  getSearchEntities,
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Stade);
