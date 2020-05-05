import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './inscription.reducer';

export interface IInscriptionProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Inscription = (props: IInscriptionProps) => {

  useEffect(() => {
    props.getEntities();
  }, []);

  


  const { inscriptionList, match, loading } = props;
  return (
    <div>
      <h2 id="inscription-heading">
        <Translate contentKey="react93App.inscription.home.title">Inscriptions</Translate>        
      </h2>
      
      <div className="table-responsive">
        {inscriptionList && inscriptionList.length > 0 ? (
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
              {inscriptionList.map((inscription, i) => (
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
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${inscription.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />                     
                      </Button>
                      <Button tag={Link} to={`${match.url}/${inscription.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />
                      </Button>
                      <Button tag={Link} to={`inscription/${inscription.id}/delete`} color="danger" size="sm">
                        <FontAwesomeIcon icon="trash" />
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
              <Translate contentKey="react93App.inscription.home.notFound">No Inscriptions found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ inscription }: IRootState) => ({
  inscriptionList: inscription.entities,
  loading: inscription.loading
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Inscription);
