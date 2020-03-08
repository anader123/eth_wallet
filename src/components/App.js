import React, { Component } from 'react';
import daiLogo from '../dai-logo.png';
import './App.css';
import Web3 from 'web3';
import DaiTokenMock from '../abis/DaiTokenMock.json'

// Components
import TxInfo from './TxInfo';
import TransferForm from './TransferForm';
import Navbar from './Navbar';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      shortAccount: '',
      daiTokenMock: null,
      balance: 0,
      transactions: [],
      daiTokenAddress: "0xA3019CB8Ab1ED67cA4d7957EC4FA630803A075a1",
      walletConnected: false
    }
  }

  async componentDidMount() {
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
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      this.setState({ web3 });
    }
    else if (window.web3) {
      const web3 = new Web3(window.web3.currentProvider);
      this.setState({ web3 });
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  loadBlockchainData = async () => {
    const { daiTokenAddress, account, web3 } = this.state;

    const accounts = await web3.eth.getAccounts();
    const shortAccount = `${accounts[0].slice(0, 5)}...${accounts[0].slice(36, 41)}`
    this.setState({ account: accounts[0], shortAccount })

    const daiTokenMock = new web3.eth.Contract(DaiTokenMock.abi, daiTokenAddress)
    this.setState({ daiTokenMock: daiTokenMock });

    const balance = await daiTokenMock.methods.balanceOf(accounts[0]).call()
    this.setState({ balance: web3.utils.fromWei(balance.toString(), 'Ether') })

    const transactions = await daiTokenMock.getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest', filter: { from: account } })
    this.setState({ transactions })
    console.log(transactions)
  }

  transferDai = async (recipient, amount) => {
    const { daiTokenMock, account, web3 } = this.state;
    const decimalBalance = await daiTokenMock.methods.balanceOf(account).call();

    // console.log(decimalBalance)

    // const balance = web3.utils.fromWei(decimalBalance);

    // console.log(balance)
    
    // if(balance >= amount) {
      await daiTokenMock.methods.transfer(recipient, amount).send({ from: account });
      const transactions = await daiTokenMock.getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest', filter: { from: account } })
      this.setState({ transactions })
      console.log(transactions)
    // }
    // else {
    //   window.alert("You have less than that amount of DAI in this address");
    // }
  }

  render() {
    const { 
      balance, 
      transactions, 
      account, 
      walletConnected, 
      shortAccount,
      web3
    } = this.state;
    return (
      <div>
        <Navbar 
        walletConnected={walletConnected} 
        account={account} 
        shortAccount={shortAccount} 
        connectWallet={this.connectWallet}
        />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto" style={{ width: "500px" }}>
                <br/>
                <img src={daiLogo} width="150" />
                <br/>
                {!walletConnected
                ?
                <div>Connect wallet to continue.</div>
                :
                <div>
                  <h1>{balance} DAI</h1>
                  <TransferForm web3={web3} transferDai={this.transferDai}/>
                  <TxInfo web3={web3} transactions={transactions}/>
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
