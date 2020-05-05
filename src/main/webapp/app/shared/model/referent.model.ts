import { IUser } from 'app/shared/model/user.model';

export interface IReferent {
  id?: number;
  nom?: string;
  prenom?: string;
  licence?: string;
  telephone?: string;
  email?: string;
  user?: IUser;
}

export const defaultValue: Readonly<IReferent> = {};
