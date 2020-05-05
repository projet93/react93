import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './categorie.reducer';
import { ICategorie } from 'app/shared/model/categorie.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ICategorieDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const CategorieDetail = (props: ICategorieDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { categorieEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="react93App.categorie.detail.title">Categorie</Translate> [<b>{categorieEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="section">
              <Translate contentKey="react93App.categorie.section">Section</Translate>
            </span>
          </dt>
          <dd>{categorieEntity.section}</dd>
          <dt>
            <span id="descrition">
              <Translate contentKey="react93App.categorie.descrition">Descrition</Translate>
            </span>
          </dt>
          <dd>{categorieEntity.descrition}</dd>
          <dt>
            <Translate contentKey="react93App.categorie.user">User</Translate>
          </dt>
          <dd>{categorieEntity.user ? categorieEntity.user.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/categorie" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/categorie/${categorieEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ categorie }: IRootState) => ({
  categorieEntity: categorie.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CategorieDetail);
