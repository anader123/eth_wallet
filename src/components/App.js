import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import { abi } from '../abis/DaiTokenMock.json';
import { tokenData } from '../utils/tokenData';

// Big Num
import BigNumber from 'bignumber.js';

// Images
import usdcLogo from '../img/usdc.svg'
import daiLogo from '../img/dai-logo.png';

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
      tokenContractInstance: null,
      balance: 0,
      transactions: [],
      tokenAddress: "0x8E4b528F0B28Da2014874539837C1f6a464307a6",
      walletConnected: false,
      tokenImg: daiLogo,
      tokenSymbol: 'DAI',
      tokenDecimals: 18
    }

    BigNumber.config({ DECIMAL_PLACES: 4 });
  }

  async componentDidMount() {
    // await this.loadWeb3();
    // await this.loadBlockchainData();
    // this.setState({ walletConnected: true });
    this.checkAccount();
  }

  connectWallet = async () => {
    await this.loadWeb3();
    await this.loadBlockchainData();
    this.setState({ walletConnected: true });
  }

  checkAccount = async () => {
    window.ethereum.on('accountsChanged', accounts => {
      if(this.state.web3) {
        this.loadBlockchainData();
      }
    })
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
    const { tokenAddress, web3, tokenDecimals, tokenSymbol } = this.state;

    const accounts = await web3.eth.getAccounts();
    const account = accounts[0]; 

    const shortAccount = `${account.slice(0, 5)}...${account.slice(37, 42)}`
    this.setState({ account: account, shortAccount })

    const tokenContractInstance = new web3.eth.Contract(abi, tokenAddress)
    this.setState({ tokenContractInstance });

    const decimalsBalance = await tokenContractInstance.methods.balanceOf(account).call();
    const balance = this.formatTokenAmount(decimalsBalance, tokenDecimals)
    this.setState({ balance })

    const transactions = await tokenContractInstance.getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest', filter: { from: account } })
    this.setState({ transactions })
  }

  changeToken = async (index) => {
    const { web3 } = this.state;

    const tokenAddress = tokenData[index].address;
    const tokenSymbol = tokenData[index].symbol;
    const tokenDecimals = tokenData[index].decimal;
    // const tokenContractInstance = new web3.eth.Contract(abi, tokenAddress);
    
    await this.setState({ tokenAddress, tokenSymbol, tokenDecimals })
    
    this.loadBlockchainData();

    if(index === 0) {
      this.setState({ tokenImg: daiLogo });
    }
    else {
      this.setState({ tokenImg: usdcLogo });
    }
  }

  transferDai = async (recipient, amount) => {
    const { tokenContractInstance, account, web3 } = this.state;
    const decimalBalance = await tokenContractInstance.methods.balanceOf(account).call();

    // console.log(decimalBalance)

    // const balance = web3.utils.fromWei(decimalBalance);

    // console.log(balance)
    
    // if(balance >= amount) {
      await tokenContractInstance.methods.transfer(recipient, amount).send({ from: account });
      const transactions = await tokenContractInstance.getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest', filter: { from: account } })
      this.setState({ transactions });
      console.log(transactions)
    // }
    // else {
    //   window.alert("You have less than that amount of DAI in this address");
    // }
  }

  formatTokenAmount = (amount, decimals) => {
    const bn = new BigNumber(amount);
    return bn.shiftedBy(-decimals).toString(10);
  }

  render() {
    const { 
      balance, 
      transactions, 
      account, 
      walletConnected, 
      shortAccount,
      web3,
      tokenImg,
      tokenSymbol,
      tokenDecimals    
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
                <img src={tokenImg} width="150" />
                <br/>
                {!walletConnected
                ?
                <div>Connect wallet to continue.</div>
                :
                <div>
                  <h1>{balance} {tokenSymbol}</h1>
                  <TransferForm 
                  web3={web3} 
                  transferDai={this.transferDai}
                  changeToken={this.changeToken}
                  tokenSymbol={tokenSymbol}
                  />
                  <TxInfo 
                  web3={web3} 
                  transactions={transactions}
                  tokenSymbol={tokenSymbol}
                  formatTokenAmount={this.formatTokenAmount}
                  tokenDecimals={tokenDecimals}
                  />
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
