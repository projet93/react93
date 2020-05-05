import { Moment } from 'moment';
import { IInscription } from 'app/shared/model/inscription.model';
import { IReferent } from 'app/shared/model/referent.model';
import { IUser } from 'app/shared/model/user.model';
import { IStade } from 'app/shared/model/stade.model';
import { ICategorie } from 'app/shared/model/categorie.model';
import { Statut } from 'app/shared/model/enumerations/statut.model';

export interface IPlateau {
  id?: number;
  dateDebut?: Moment;
  dateFin?: Moment;
  programmeContentType?: string;
  programme?: any;
  nombreEquipeMax?: number;
  nombreEquipe?: number;
  statut?: Statut;
  valid?: boolean;
  version?: number;
  inscriptions?: IInscription[];
  referent?: IReferent;
  user?: IUser;
  stade?: IStade;
  categorie?: ICategorie;
}

export const defaultValue: Readonly<IPlateau> = {
  valid: false
};
