import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import Currency from './Currency';
import TransactionStatus from './TransactionStatus';
import Avatar from './Avatar';

class Transaction extends Component {
  render() {
    const {
      amount,
      description,
      id,
      GroupId,
      createdAt,
      user
    } = this.props;

    return (
      <div className='Transaction'>
        <Link to={`/groups/${GroupId}/transactions/${id}`}>
          <Avatar url={user.avatar} />
          <div className='Transaction-info'>
            <div className='Transaction-created'>
              {createdAt ? moment(createdAt).fromNow() : ''}
            </div>
            <div className='Transaction-description'>{description}</div>
            <div className='Transaction-status'>
              <div className='Transaction-amount'><Currency value={amount} /></div>
              <div className='Transaction-approved'><TransactionStatus {...this.props} /></div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

Transaction.propTypes = {
  id: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired
};

export default Transaction;