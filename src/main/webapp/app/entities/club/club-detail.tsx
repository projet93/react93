import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, openFile, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './club.reducer';
import { IClub } from 'app/shared/model/club.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import plateau from '../plateau/plateau';

export interface IClubDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> { }

export const ClubDetail = (props: IClubDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { clubEntity } = props;

  
  return (
    <Row>
      
        <Col sm="3">
          <img src={`data:${clubEntity.logoContentType};base64,${clubEntity.logo}`} className="log-club" />
        </Col>
        <Col sm="5">
          <h2>
            <Translate contentKey="react93App.club.detail.title">Club</Translate> [<b>{clubEntity.id}</b>]
        </h2>
          <dl className="row">
            <dt className="col-sm-4">
              <span id="logo">
                <Translate contentKey="react93App.club.logo">Logo</Translate>
              </span>
            </dt>
            <dd className="col-sm-8">
              {clubEntity.logo ? (
                <div>
                  <a onClick={openFile(clubEntity.logoContentType, clubEntity.logo)}>
                    <Translate contentKey="entity.action.open">Open</Translate>&nbsp;
                </a>
                  <span>
                    {clubEntity.logoContentType}, {byteSize(clubEntity.logo)}
                  </span>
                </div>
              ) : null}
            </dd>
            <dt className="col-sm-4">
              <span id="nom">
                <Translate contentKey="react93App.club.nom">Nom</Translate>
              </span>
            </dt>
            <dd className="col-sm-8">{clubEntity.nom}</dd>
            <dt className="col-sm-4">
              <span id="adresse">
                <Translate contentKey="react93App.club.adresse">Adresse</Translate>
              </span>
            </dt>
            <dd className="col-sm-8">{clubEntity.adresse}</dd>
            <dt className="col-sm-4">
              <span id="telephone">
                <Translate contentKey="react93App.club.telephone">Telephone</Translate>
              </span>
            </dt>
            <dd className="col-sm-8">{clubEntity.telephone}</dd>
            <dt className="col-sm-4">
              <span id="email">
                <Translate contentKey="react93App.club.email">Email</Translate>
              </span>
            </dt>
            <dd className="col-sm-8">{clubEntity.email}</dd>
            <dt className="col-sm-4">
              <Translate contentKey="react93App.club.user">User</Translate>
            </dt>
            <dd className="col-sm-8">{clubEntity.user ? clubEntity.user.login : ''}</dd>
            <dt className="col-sm-4">
              <Translate contentKey="react93App.club.categorie">Categorie</Translate>
            </dt>
            <dd className="col-sm-8">
              {clubEntity.categories
                ? clubEntity.categories.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.section}</a>
                    {i === clubEntity.categories.length - 1 ? '' : ', '}
                  </span>
                ))
                : null}
            </dd>
          </dl>
          <Button tag={Link} to="/club" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
        &nbsp;
        <Button tag={Link} to={`/club/${clubEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.edit">Edit</Translate>
            </span>
          </Button>
        </Col>
    </Row>
  );
};

const mapStateToProps = ({ club }: IRootState) => ({
  clubEntity: club.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ClubDetail);
