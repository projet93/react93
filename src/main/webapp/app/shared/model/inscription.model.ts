import { IPlateau } from 'app/shared/model/plateau.model';
import { IClub } from 'app/shared/model/club.model';
import { IReferent } from 'app/shared/model/referent.model';

export interface IInscription {
  id?: number;
  nombreEquipe?: number;
  plateau?: IPlateau;
  club?: IClub;
  referent?: IReferent;
}

export const defaultValue: Readonly<IInscription> = {};
