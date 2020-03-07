import React, { Component } from 'react';
import daiLogo from '../dai-logo.png';
import './App.css';
import Web3 from 'web3';
import DaiTokenMock from '../abis/DaiTokenMock.json'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      daiTokenMock: null,
      balance: 0,
      transactions: [],
      daiTokenAddress: "0xA3019CB8Ab1ED67cA4d7957EC4FA630803A075a1",
      walletConnected: false
    }
  }

  async componentDidMount() {
    console.log(window.ethereum.selectedAddress)
    if(window.ethereum.selectedAddress !== undefined) { 
      await this.loadWeb3();
      await this.loadBlockchainData();
      this.setState({ walletConnected: true });
    } 
    else {
      console.log('hit here')
    }
  }

  connectWallet = async () => {
    await this.loadWeb3();
    await this.loadBlockchainData();
    this.setState({ walletConnected: true });
  }

  loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  loadBlockchainData = async () => {
    const { daiTokenAddress, account } = this.state;

    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const daiTokenMock = new web3.eth.Contract(DaiTokenMock.abi, daiTokenAddress)
    this.setState({ daiTokenMock: daiTokenMock });

    const balance = await daiTokenMock.methods.balanceOf(accounts[0]).call()
    this.setState({ balance: web3.utils.fromWei(balance.toString(), 'Ether') })

    const transactions = await daiTokenMock.getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest', filter: { from: account } })
    this.setState({ transactions })
    console.log(transactions)
  }

  transfer = async (recipient, amount) => {
    const { daiTokenMock, account } = this.state;
    const balance = await daiTokenMock.methods.balanceOf(account);
    
    if(balance >= amount) {
      daiTokenMock.methods.transfer(recipient, amount).send({ from: account });
    }
    else {
      window.alert("You have less than that amount of DAI in this address");
    }
  }

  render() {
    const { balance, transactions, account, walletConnected } = this.state;
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <div
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          >
            Simple Dai Wallet
          </div>
          {!walletConnected 
          ?
          <button onClick={this.connectWallet}>Connect Wallet</button>
          :
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href={`https://etherscan.io/address/${account}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {account}
          </a>
          }
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto" style={{ width: "500px" }}>
                <img src={daiLogo} width="150" />
                {!walletConnected
                ?
                <div>Connect wallet to continue.</div>
                :
                <div>
                  <h1>{balance} DAI</h1>
                  <form onSubmit={(event) => {
                    event.preventDefault()
                    const recipient = this.recipient.value
                    const amount = window.web3.utils.toWei(this.amount.value, 'Ether')
                    this.transfer(recipient, amount)
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
                            <td>{window.web3.utils.fromWei(tx.returnValues.value.toString(), 'Ether')} DAI </td>
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
                }
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
