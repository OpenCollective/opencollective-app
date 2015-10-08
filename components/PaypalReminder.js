import React, { Component } from 'react';
import { rejectTransaction } from '../actions/transactions';

class PaypalReminder extends Component {

  render() {
    return (
      <div className='PaypalReminder'>
        Please, connect your PayPal account to start sending funds.
        <div className='Button'>Login with PayPal</div>
      </div>
    );
  }

  handleClick() {
    const { rejectTransaction, groupid, transactionid } = this.props;
    rejectTransaction(groupid, transactionid);
  }
}

export default PaypalReminder;
