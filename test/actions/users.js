import expect from 'expect';
import nock from 'nock';
import mockStore from '../helpers/mockStore';
import env from '../../lib/env';
import * as constants from '../../constants/users';
import {
  getApprovalKeyForUser,
  confirmApprovalKey,
  fetchUserIfNeeded,
  fetchUserGroups,
} from '../../actions/users';

describe('users actions', () => {

  afterEach(() => {
    nock.cleanAll();
  });

  describe('preapproval per user', () => {

    it('creates GET_APPROVAL_KEY_FOR_USER_SUCCESS if it is successful', (done) => {
      const userid = 1;
      const json = { preapprovalKey: 'abc' };
      nock(env.API_ROOT)
        .get(`/users/${userid}/paypal/preapproval`)
        .query(true) // match all query params
        .reply(200, json);

      const expected = [
        { type: constants.GET_APPROVAL_KEY_FOR_USER_REQUEST, userid },
        { type: constants.GET_APPROVAL_KEY_FOR_USER_SUCCESS, userid, json },
      ];

      const store = mockStore({}, expected, done);
      store.dispatch(getApprovalKeyForUser(userid));
    });

    it('creates GET_APPROVAL_KEY_FOR_USER_FAILURE if it fails', (done) => {
      const userid = 1;

      nock(env.API_ROOT)
        .get(`/users/${userid}/paypal/preapproval`)
        .query(true) // match all query params
        .replyWithError('Something went wrong!');

      const expected = [
        { type: constants.GET_APPROVAL_KEY_FOR_USER_REQUEST, userid },
        { type: constants.GET_APPROVAL_KEY_FOR_USER_FAILURE, error: {} }
      ];

      const store = mockStore({}, expected, done);
      store.dispatch(getApprovalKeyForUser(userid));
    });
  });

 describe('confirm preapproval per user', () => {

    it('creates CONFIRM_APPROVAL_KEY_SUCCESS if it is successful', (done) => {
      const userid = 1;
      const preapprovalKey = 'abc';
      const json = { id: 3 };

      nock(env.API_ROOT)
        .post(`/users/${userid}/paypal/preapproval/${preapprovalKey}`)
        .reply(200, json);

      const expected = [
        { type: constants.CONFIRM_APPROVAL_KEY_REQUEST, userid, preapprovalKey },
        { type: constants.CONFIRM_APPROVAL_KEY_SUCCESS, userid, preapprovalKey, json }
      ];

      const store = mockStore({}, expected, done);
      store.dispatch(confirmApprovalKey(userid, preapprovalKey));
    });

    it('creates CONFIRM_APPROVAL_KEY_FAILURE if it fails', (done) => {
      const userid = 1;
      const preapprovalKey = 'abc';

      nock(env.API_ROOT)
        .post(`/users/${userid}/paypal/preapproval/${preapprovalKey}`)
        .replyWithError('Something went wrong!');

      const expected = [
        { type: constants.CONFIRM_APPROVAL_KEY_REQUEST, userid, preapprovalKey },
        { type: constants.CONFIRM_APPROVAL_KEY_FAILURE, error: {} }
      ];

      const store = mockStore({}, expected, done);
      store.dispatch(confirmApprovalKey(userid, preapprovalKey));
    });
  });

  describe('fetch user if needed', () => {

    it('should not fetch if the user is already in the store', (done) => {
      const user = { id: 1 };
      const state = {
        users: {
          [user.id]: user
        }
      };
      const expected = [{ type: constants.FETCH_USER_FROM_STATE, user }];

      const store = mockStore(state, expected, done);
      store.dispatch(fetchUserIfNeeded(user.id));
    });

    it('should fetch the user if it is not in the state', (done) => {
      const id = 1;
      const user = { id };
      const users = { [id]: user };

      nock(env.API_ROOT)
        .get(`/users/${id}`)
        .reply(200, user);

      const expected = [
        { type: constants.FETCH_USER_REQUEST, id: id },
        { type: constants.FETCH_USER_SUCCESS, id: id, users }
      ];

      const store = mockStore({ users: {} }, expected, done);
      store.dispatch(fetchUserIfNeeded(user.id));
    });

    it('creates FETCH_USER_FAILURE if it fails', (done) => {
      const id = 1;

      nock(env.API_ROOT)
        .get(`/users/${id}`)
        .replyWithError('Something went wrong!');

      const expected = [
        { type: constants.FETCH_USER_REQUEST, id: id },
        { type: constants.FETCH_USER_FAILURE, error: {} }
      ];

      const store = mockStore({ users: {} }, expected, done);
      store.dispatch(fetchUserIfNeeded(id));
    });
  });

  describe('fetch user groups', () => {

    it('creates USER_GROUPS_SUCCESS if it successfully fetches groups', (done) => {
      const userid = 1;
      const reponse = [
        { id: 2 },
        { id: 3 }
      ];
      const groups = {
        2: { id: 2 },
        3: { id: 3 }
      };

      nock(env.API_ROOT)
        .get(`/users/${userid}/groups`)
        .query(true) // match all query params
        .reply(200, reponse);

      const expected = [
        { type: constants.USER_GROUPS_REQUEST, userid },
        { type: constants.USER_GROUPS_SUCCESS, userid, groups }
      ];

      const store = mockStore({}, expected, done);
      store.dispatch(fetchUserGroups(userid));
    });

    it('creates USER_GROUPS_FAILURE if it fails', (done) => {
      const userid = 1;

      nock(env.API_ROOT)
        .get(`/users/${userid}/groups`)
        .replyWithError('Something went wrong!');

      const expected = [
        { type: constants.USER_GROUPS_REQUEST, userid },
        { type: constants.USER_GROUPS_FAILURE, error: {} }
      ];

      const store = mockStore({}, expected, done, true);
      store.dispatch(fetchUserGroups(userid));
    });
  });

});