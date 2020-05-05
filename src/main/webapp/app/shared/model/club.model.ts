import { IStade } from 'app/shared/model/stade.model';
import { IUser } from 'app/shared/model/user.model';
import { ICategorie } from 'app/shared/model/categorie.model';

export interface IClub {
  id?: number;
  logoContentType?: string;
  logo?: any;
  nom?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  stades?: IStade[];
  user?: IUser;
  categories?: ICategorie[];
}

export const defaultValue: Readonly<IClub> = {};
