import React, { Component } from 'react'

export default class TxInfo extends Component {
    render() {
        const { 
          transactions, 
          tokenSymbol, 
          formatTokenAmount, 
          tokenDecimals
        } = this.props;
        return (
            <div>
                <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Recipient</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Tx</th>
                      </tr>
                    </thead>
                    <tbody>
                      { transactions.map((tx, key) => {
                        return (
                          <tr key={key} >
                            <td>{tx.returnValues.to}</td>
                            <td>{formatTokenAmount(tx.returnValues.value, tokenDecimals)} {tokenSymbol} </td>
                            <td>
                              <a
                              href={`https://etherscan.io/tx/${tx.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              >
                                View
                              </a>
                            </td>
                          </tr>
                        )
                      }) }
                    </tbody>
                  </table>
            </div>
        )
    }
}
