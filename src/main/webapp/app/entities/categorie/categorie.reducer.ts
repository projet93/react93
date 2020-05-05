import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ICategorie, defaultValue } from 'app/shared/model/categorie.model';

export const ACTION_TYPES = {
  SEARCH_CATEGORIES: 'categorie/SEARCH_CATEGORIES',
  FETCH_CATEGORIE_LIST: 'categorie/FETCH_CATEGORIE_LIST',
  FETCH_CATEGORIE: 'categorie/FETCH_CATEGORIE',
  CREATE_CATEGORIE: 'categorie/CREATE_CATEGORIE',
  UPDATE_CATEGORIE: 'categorie/UPDATE_CATEGORIE',
  DELETE_CATEGORIE: 'categorie/DELETE_CATEGORIE',
  RESET: 'categorie/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ICategorie>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type CategorieState = Readonly<typeof initialState>;

// Reducer

export default (state: CategorieState = initialState, action): CategorieState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_CATEGORIES):
    case REQUEST(ACTION_TYPES.FETCH_CATEGORIE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CATEGORIE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_CATEGORIE):
    case REQUEST(ACTION_TYPES.UPDATE_CATEGORIE):
    case REQUEST(ACTION_TYPES.DELETE_CATEGORIE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_CATEGORIES):
    case FAILURE(ACTION_TYPES.FETCH_CATEGORIE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CATEGORIE):
    case FAILURE(ACTION_TYPES.CREATE_CATEGORIE):
    case FAILURE(ACTION_TYPES.UPDATE_CATEGORIE):
    case FAILURE(ACTION_TYPES.DELETE_CATEGORIE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_CATEGORIES):
    case SUCCESS(ACTION_TYPES.FETCH_CATEGORIE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_CATEGORIE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_CATEGORIE):
    case SUCCESS(ACTION_TYPES.UPDATE_CATEGORIE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_CATEGORIE):
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

const apiUrl = 'api/categories';
const apiSearchUrl = 'api/_search/categories';

// Actions

export const getSearchEntities: ICrudSearchAction<ICategorie> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_CATEGORIES,
  payload: axios.get<ICategorie>(`${apiSearchUrl}?query=${query}`)
});

export const getEntities: ICrudGetAllAction<ICategorie> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_CATEGORIE_LIST,
  payload: axios.get<ICategorie>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<ICategorie> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CATEGORIE,
    payload: axios.get<ICategorie>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ICategorie> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CATEGORIE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ICategorie> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CATEGORIE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ICategorie> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CATEGORIE,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
