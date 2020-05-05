import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IStade, defaultValue } from 'app/shared/model/stade.model';

export const ACTION_TYPES = {
  SEARCH_STADES: 'stade/SEARCH_STADES',
  FETCH_STADE_LIST: 'stade/FETCH_STADE_LIST',
  FETCH_STADE: 'stade/FETCH_STADE',
  CREATE_STADE: 'stade/CREATE_STADE',
  UPDATE_STADE: 'stade/UPDATE_STADE',
  DELETE_STADE: 'stade/DELETE_STADE',
  RESET: 'stade/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IStade>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type StadeState = Readonly<typeof initialState>;

// Reducer

export default (state: StadeState = initialState, action): StadeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_STADES):
    case REQUEST(ACTION_TYPES.FETCH_STADE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_STADE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_STADE):
    case REQUEST(ACTION_TYPES.UPDATE_STADE):
    case REQUEST(ACTION_TYPES.DELETE_STADE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_STADES):
    case FAILURE(ACTION_TYPES.FETCH_STADE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_STADE):
    case FAILURE(ACTION_TYPES.CREATE_STADE):
    case FAILURE(ACTION_TYPES.UPDATE_STADE):
    case FAILURE(ACTION_TYPES.DELETE_STADE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_STADES):
    case SUCCESS(ACTION_TYPES.FETCH_STADE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_STADE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_STADE):
    case SUCCESS(ACTION_TYPES.UPDATE_STADE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_STADE):
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

const apiUrl = 'api/stades';
const apiSearchUrl = 'api/_search/stades';

// Actions

export const getSearchEntities: ICrudSearchAction<IStade> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_STADES,
  payload: axios.get<IStade>(`${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`)
});

export const getEntities: ICrudGetAllAction<IStade> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_STADE_LIST,
    payload: axios.get<IStade>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IStade> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_STADE,
    payload: axios.get<IStade>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IStade> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_STADE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IStade> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_STADE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IStade> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_STADE,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
