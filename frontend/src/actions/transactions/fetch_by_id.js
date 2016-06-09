import { get } from '../../lib/api';
import Schemas from '../../lib/schemas';
import * as constants from '../../constants/transactions';

/**
 * Fetch one transaction in a group
 */

export default (groupid, transactionid) => {
  const prefix = transactionid[0];
  const type = prefix === 'e' ? 'expenses' : 'transactions';
  transactionid = transactionid.slice(1);
  return dispatch => {
    dispatch(request(groupid, transactionid));

    return get(`groups/${groupid}/${type}/${transactionid}`, {
      schema: Schemas.TRANSACTION
    })
    .then(t => {
      t.id = prefix+t.id;
      return t;
    })
    .then(json => dispatch(success(groupid, transactionid, json)))
    .catch(error => dispatch(failure(error)));
  };
};

function request(groupid, transactionid) {
  return {
    type: constants.TRANSACTION_REQUEST,
    groupid,
    transactionid
  };
}

function success(groupid, transactionid, json) {
  return {
    type: constants.TRANSACTION_SUCCESS,
    groupid,
    transactionid,
    transactions: json.transactions,
  };
}

function failure(error) {
  return {
    type: constants.TRANSACTION_FAILURE,
    error,
  };
}
