import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IInscription, defaultValue } from 'app/shared/model/inscription.model';
import { IPlateau } from 'app/shared/model/plateau.model';

export const ACTION_TYPES = {
  SEARCH_INSCRIPTIONS: 'inscription/SEARCH_INSCRIPTIONS',
  FETCH_INSCRIPTION_LIST: 'inscription/FETCH_INSCRIPTION_LIST',
  FETCH_PLATEAU_LIST: 'plateau/FETCH_PLATEAU_LIST',
  FETCH_INSCRIPTION: 'inscription/FETCH_INSCRIPTION',
  CREATE_INSCRIPTION: 'inscription/CREATE_INSCRIPTION',
  UPDATE_INSCRIPTION: 'inscription/UPDATE_INSCRIPTION',
  DELETE_INSCRIPTION: 'inscription/DELETE_INSCRIPTION',
  RESET: 'inscription/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IInscription>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type InscriptionState = Readonly<typeof initialState>;

// Reducer

export default (state: InscriptionState = initialState, action): InscriptionState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_INSCRIPTIONS):
    case REQUEST(ACTION_TYPES.FETCH_PLATEAU_LIST):
    case REQUEST(ACTION_TYPES.FETCH_INSCRIPTION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_INSCRIPTION):
    case REQUEST(ACTION_TYPES.UPDATE_INSCRIPTION):
    case REQUEST(ACTION_TYPES.DELETE_INSCRIPTION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_INSCRIPTIONS):
    case FAILURE(ACTION_TYPES.FETCH_PLATEAU_LIST):
    case FAILURE(ACTION_TYPES.FETCH_INSCRIPTION):
    case FAILURE(ACTION_TYPES.CREATE_INSCRIPTION):
    case FAILURE(ACTION_TYPES.UPDATE_INSCRIPTION):
    case FAILURE(ACTION_TYPES.DELETE_INSCRIPTION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_INSCRIPTIONS):
    case SUCCESS(ACTION_TYPES.FETCH_PLATEAU_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_INSCRIPTION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_INSCRIPTION):
    case SUCCESS(ACTION_TYPES.UPDATE_INSCRIPTION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_INSCRIPTION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/inscriptions';
const apiSearchUrl = 'api/_search/inscriptions';

// Actions

export const getSearchEntities: ICrudSearchAction<IInscription> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_INSCRIPTIONS,
  payload: axios.get<IInscription>(`${apiSearchUrl}?query=${query}`)
});

export const getEntities: ICrudGetAllAction<IPlateau> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_PLATEAU_LIST,
  payload: axios.get<IPlateau>(`${'api/plateaus'}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IInscription> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_INSCRIPTION,
    payload: axios.get<IInscription>(requestUrl)
  };
};


export const createEntity: ICrudPutAction<IInscription> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_INSCRIPTION,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IInscription> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_INSCRIPTION,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IInscription> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_INSCRIPTION,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
