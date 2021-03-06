import fetch from 'isomorphic-fetch';
import { normalize } from 'normalizr';
import extend from 'lodash/object/extend';
import queryString from 'query-string';
import env from './env';

const API_ROOT = env.API_ROOT;

/**
 * Get request
 */

export function get(endpoint, options={}) {
  const { schema, params } = options;

  return fetch(url(endpoint, params), {headers: headers()})
    .then(checkStatus)
    .then((json={}) => {
      return schema ? normalize(json, schema).entities : json;
    });
}

/**
 * POST json request
 */

export function postJSON(endpoint, body) {
  return fetch(url(endpoint), {
    method: 'post',
    headers: headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(body),
  })
  .then(checkStatus);
}

/**
 * PUT json request
 */

export function putJSON(endpoint, body) {
  return fetch(url(endpoint), {
    method: 'put',
    headers: headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(body),
  })
  .then(checkStatus);
}

/**
 * Auth request without tokens
 */

export function auth(body) {

  return fetch(url('authenticate'), {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  .then(checkStatus);
}

/**
 * POST request
 */

export function post(endpoint, body) {
  return fetch(url(endpoint), {
    headers: headers(),
    method: 'post',
    body,
  })
  .then(checkStatus);
}

/**
 * DELETE request
 */

export function del(endpoint) {
  return fetch(url(endpoint), {
    headers: headers(),
    method: 'delete'
  })
  .then(checkStatus);
}

/**
 * Build url to the api
 */

function url(endpoint, params) {
  const query = queryString.stringify(params);

  return `${API_ROOT + endpoint}${query.length > 0 ? `?${query}` : '' }`;
}

/**
 * The Promise returned from fetch() won't reject on HTTP error status. We
 * need to throw an error ourselves.
 */

function checkStatus(response) {
  const status = response.status;

  if (status >= 200 && status < 300) {
    return response.json();
  } else if (status === 401) {
    window.location = '/login';
  } else {
    return response.json()
    .then((json) => {
      const error = new Error(json.error.message);
      error.json = json;
      error.response = response;
      throw error;
    });
  }
}

function headers(obj) {
  const accessToken = localStorage.getItem('accessToken');
  return extend({
    Authorization: `Bearer ${accessToken}`,
  }, obj);
}
