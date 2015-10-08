import { get } from '../lib/api';
import Schemas from '../lib/schemas';

/**
 * Constants
 */

export const GROUP_REQUEST = 'GROUP_REQUEST';
export const GROUP_SUCCESS = 'GROUP_SUCCESS';
export const GROUP_FAILURE = 'GROUP_FAILURE';

/**
 * Fetch one group
 */

export function fetchGroup(id) {
  return dispatch => {
    dispatch(groupRequest(id));
    return get(`groups/${id}`, Schemas.GROUP)
      .then(json => dispatch(groupSuccess(id, json)))
      .catch(error => dispatch(groupFailure(error)));
  };
}

function groupRequest(id) {
  return {
    type: GROUP_REQUEST,
    id
  };
}

function groupSuccess(id, json) {
  return {
    type: GROUP_SUCCESS,
    id,
    groups: json.groups,
    receivedAt: Date.now(),
  };
}

function groupFailure(error) {
  return {
    type: GROUP_FAILURE,
    error,
    receivedAt: Date.now(),
  };
}
