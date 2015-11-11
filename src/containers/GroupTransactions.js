import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import values from 'lodash/object/values';
import filter from 'lodash/collection/filter';
import sortByDate from '../lib/sort_by_date';
import getUniqueValues from '../lib/get_unique_values';

import fetchUserIfNeeded from '../actions/users/fetch_by_id_cached';
import fetchTransactions from '../actions/transactions/fetch_by_group';
import fetchGroup from '../actions/groups/fetch_by_id';
import TransactionList from '../components/TransactionsList';

import Content from './Content';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GroupTitle from '../components/GroupTitle';
import EmptyList from '../components/EmptyList';

class GroupTransactions extends Component {
  render() {
    const { group, groupid, transactions, users, isLoading } = this.props;
    return (
      <div className='GroupTransactions'>
        <Header
          title={group.name}
          hasBackButton={true} />
        <Content isLoading={isLoading}>
          <GroupTitle group={group} />
          <div className='padded'>
            <div className='GroupTransactions-title'>Activity Detail</div>
            {this.list(this.props)}
          </div>
        </Content>
        <Footer groupid={groupid} />
      </div>
    );
  }

  list({transactions, users}) {
    if (transactions.length > 0) {
      return <TransactionList
        transactions={transactions}
        users={users} />
    } else {
      return <EmptyList />;
    }
  }

  componentDidMount() {
    const {
      fetchGroup,
      fetchTransactions,
      groupid,
      fetchUserIfNeeded
    } = this.props;

    fetchGroup(groupid);

    fetchTransactions(groupid)
    .then(({transactions}) => {
      return getUniqueValues(transactions, 'UserId').map(fetchUserIfNeeded);
    });
  }
}

export default connect(mapStateToProps, {
  fetchTransactions,
  fetchGroup,
  fetchUserIfNeeded
})(GroupTransactions);

function mapStateToProps({transactions, router, groups, users={}}) {
  const groupid = router.params.groupid;
  const group = groups[groupid] || {};
  const transactionsArray = values(transactions);

  return {
    groupid,
    group,
    transactions: filter(transactionsArray, {GroupId: Number(groupid)}).sort(sortByDate),
    users: users,
    isLoading: !group.id
  };
}