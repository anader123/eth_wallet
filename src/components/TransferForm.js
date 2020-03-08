import React, { Component } from 'react';
import { Dropdown, DropdownButton, Button } from 'react-bootstrap';

export default class TransferForm extends Component {
    render() {
        const { 
          web3, 
          transferDai, 
          changeToken, 
          tokenSymbol 
        } = this.props;
        return (
            <div>
                 <form 
                 className='transfer-form'
                 onSubmit={(event) => {
                    event.preventDefault()
                    const recipient = this.recipient.value
                    const amount = web3.utils.toWei(this.amount.value, 'Ether')
                    transferDai(recipient, amount)
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
                  <DropdownButton
                    title={tokenSymbol}
                    variant='primary'
                    id='dropdown-variants-Primary'
                    key='Input-Token'
                    >
                        <Dropdown.Item onSelect={() => changeToken(0)} eventKey="1">DAI</Dropdown.Item>
                        <Dropdown.Item onSelect={() => changeToken(1)} eventKey="2">USDC</Dropdown.Item>
                  </DropdownButton>
                  <br/>
            </div>
        )
    }
}
