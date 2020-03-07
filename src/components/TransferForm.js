import React, { Component } from 'react'

export default class TransferForm extends Component {
    render() {
        const { web3, transferDai } = this.props;
        return (
            <div>
                 <form onSubmit={(event) => {
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
                    <button type="submit" className="btn btn-primary btn-block">Send</button>
                  </form>
            </div>
        )
    }
}
