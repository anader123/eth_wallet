import React, { Component } from 'react';
import TokenDropdown from './TokenDropdown';

export default class TransferForm extends Component {
    render() {
        const { 
          web3, 
          transferToken, 
          changeToken, 
          tokenSymbol,
          formatTokenAmountToDecimals,
          tokenDecimals
        } = this.props;
        return (
            <div>
                 <form 
                 className='transfer-form'
                 onSubmit={(event) => {
                    event.preventDefault();
                    const recipient = this.recipient.value;
                    const amount = formatTokenAmountToDecimals(this.amount.value, tokenDecimals);
                    transferToken(recipient, amount);
                  }}>
                    <div className="form-group mr-sm-2">
                      <input
                        id="recipient"
                        type="text"
                        ref={(input) => { this.recipient = input }}
                        className="form-control"
                        placeholder="Recipient Address"
                        required />
                    </div>
                    <div className="form-group mr-sm-2">
                      <input
                        id="amount"
                        type="text"
                        ref={(input) => { this.amount = input }}
                        className="form-control"
                        placeholder="Amount"
                        required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block send-btn">Send</button>
                  </form>
                  <TokenDropdown changeToken={changeToken} tokenSymbol={tokenSymbol}/>
                  <br/>
            </div>
        )
    }
}
