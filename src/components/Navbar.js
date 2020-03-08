import React, { Component } from 'react';
import { Dropdown, DropdownButton, Button } from 'react-bootstrap';


export default class Navbar extends Component {
    render() {
        const { shortAccount, account, walletConnected, connectWallet, changeToken } = this.props;
        return (
            <div>
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <div
                className="navbar-brand col-sm-3 col-md-2 mr-0"
                >
                    Simple Token Wallet
                </div>
                {!walletConnected 
                ?
                <button onClick={connectWallet}>Connect Wallet</button>
                :
                <div>
                    <DropdownButton
                    // title={tokenSymbol}
                    variant='primary'
                    id='dropdown-variants-Primary'
                    key='Input-Token'
                    >
                        <Dropdown.Item onSelect={() => changeToken(0)} eventKey="1">DAI</Dropdown.Item>
                        <Dropdown.Item onSelect={() => changeToken(1)} eventKey="2">USDC</Dropdown.Item>
                    </DropdownButton>
                    <a
                    className="navbar-brand"
                    href={`https://etherscan.io/address/${account}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    {shortAccount}
                    </a>
                </div>
                }
                </nav>
            </div>
        )
    }
}
