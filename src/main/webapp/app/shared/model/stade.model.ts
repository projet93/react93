import { IUser } from 'app/shared/model/user.model';
import { IClub } from 'app/shared/model/club.model';

export interface IStade {
  id?: number;
  nom?: string;
  adresse?: string;
  codePostal?: string;
  ville?: string;
  user?: IUser;
  club?: IClub;
}

export const defaultValue: Readonly<IStade> = {};
