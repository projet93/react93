import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IReferent, defaultValue } from 'app/shared/model/referent.model';

export const ACTION_TYPES = {
  SEARCH_REFERENTS: 'referent/SEARCH_REFERENTS',
  FETCH_REFERENT_LIST: 'referent/FETCH_REFERENT_LIST',
  FETCH_REFERENT: 'referent/FETCH_REFERENT',
  CREATE_REFERENT: 'referent/CREATE_REFERENT',
  UPDATE_REFERENT: 'referent/UPDATE_REFERENT',
  DELETE_REFERENT: 'referent/DELETE_REFERENT',
  RESET: 'referent/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IReferent>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type ReferentState = Readonly<typeof initialState>;

// Reducer

export default (state: ReferentState = initialState, action): ReferentState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_REFERENTS):
    case REQUEST(ACTION_TYPES.FETCH_REFERENT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_REFERENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_REFERENT):
    case REQUEST(ACTION_TYPES.UPDATE_REFERENT):
    case REQUEST(ACTION_TYPES.DELETE_REFERENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_REFERENTS):
    case FAILURE(ACTION_TYPES.FETCH_REFERENT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_REFERENT):
    case FAILURE(ACTION_TYPES.CREATE_REFERENT):
    case FAILURE(ACTION_TYPES.UPDATE_REFERENT):
    case FAILURE(ACTION_TYPES.DELETE_REFERENT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_REFERENTS):
    case SUCCESS(ACTION_TYPES.FETCH_REFERENT_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_REFERENT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_REFERENT):
    case SUCCESS(ACTION_TYPES.UPDATE_REFERENT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_REFERENT):
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

const apiUrl = 'api/referents';
const apiSearchUrl = 'api/_search/referents';

// Actions

export const getSearchEntities: ICrudSearchAction<IReferent> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_REFERENTS,
  payload: axios.get<IReferent>(`${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`)
});

export const getEntities: ICrudGetAllAction<IReferent> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_REFERENT_LIST,
    payload: axios.get<IReferent>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IReferent> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_REFERENT,
    payload: axios.get<IReferent>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IReferent> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_REFERENT,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IReferent> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_REFERENT,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IReferent> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_REFERENT,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
