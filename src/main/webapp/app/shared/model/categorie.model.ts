import { IUser } from 'app/shared/model/user.model';
import { IClub } from 'app/shared/model/club.model';
import { Section } from 'app/shared/model/enumerations/section.model';

export interface ICategorie {
  id?: number;
  section?: Section;
  descrition?: string;
  user?: IUser;
  clubs?: IClub[];
}

export const defaultValue: Readonly<ICategorie> = {};
