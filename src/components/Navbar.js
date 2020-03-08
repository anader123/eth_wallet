import React, { Component } from 'react'

export default class Navbar extends Component {
    render() {
        const { shortAccount, account, walletConnected, connectWallet } = this.props;
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
                <button onClick={connectWallet}>Connect Wallet</button>
                :
                <a
                    className="navbar-brand"
                    href={`https://etherscan.io/address/${account}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {shortAccount}
                </a>
                }
                </nav>
            </div>
        )
    }
}
