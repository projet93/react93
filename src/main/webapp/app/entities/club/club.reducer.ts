import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IClub, defaultValue } from 'app/shared/model/club.model';

export const ACTION_TYPES = {
  SEARCH_CLUBS: 'club/SEARCH_CLUBS',
  FETCH_CLUB_LIST: 'club/FETCH_CLUB_LIST',
  FETCH_CLUB: 'club/FETCH_CLUB',
  CREATE_CLUB: 'club/CREATE_CLUB',
  UPDATE_CLUB: 'club/UPDATE_CLUB',
  DELETE_CLUB: 'club/DELETE_CLUB',
  SET_BLOB: 'club/SET_BLOB',
  RESET: 'club/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IClub>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type ClubState = Readonly<typeof initialState>;

// Reducer

export default (state: ClubState = initialState, action): ClubState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_CLUBS):
    case REQUEST(ACTION_TYPES.FETCH_CLUB_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CLUB):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_CLUB):
    case REQUEST(ACTION_TYPES.UPDATE_CLUB):
    case REQUEST(ACTION_TYPES.DELETE_CLUB):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_CLUBS):
    case FAILURE(ACTION_TYPES.FETCH_CLUB_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CLUB):
    case FAILURE(ACTION_TYPES.CREATE_CLUB):
    case FAILURE(ACTION_TYPES.UPDATE_CLUB):
    case FAILURE(ACTION_TYPES.DELETE_CLUB):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_CLUBS):
    case SUCCESS(ACTION_TYPES.FETCH_CLUB_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_CLUB):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_CLUB):
    case SUCCESS(ACTION_TYPES.UPDATE_CLUB):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_CLUB):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.SET_BLOB: {
      const { name, data, contentType } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          [name]: data,
          [name + 'ContentType']: contentType
        }
      };
    }
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/clubs';
const apiSearchUrl = 'api/_search/clubs';

// Actions

export const getSearchEntities: ICrudSearchAction<IClub> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_CLUBS,
  payload: axios.get<IClub>(`${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`)
});

export const getEntities: ICrudGetAllAction<IClub> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_CLUB_LIST,
    payload: axios.get<IClub>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IClub> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CLUB,
    payload: axios.get<IClub>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IClub> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CLUB,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IClub> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CLUB,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IClub> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CLUB,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const setBlob = (name, data, contentType?) => ({
  type: ACTION_TYPES.SET_BLOB,
  payload: {
    name,
    data,
    contentType
  }
});

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
