import React, { Component } from 'react';
import { tokenData } from '../utils/tokenData';
import { Dropdown, DropdownButton, Button } from 'react-bootstrap';

export default class TokenDropdown extends Component {
    render() {
        const { tokenSymbol, changeToken } = this.props;
        return (
            <div>
                <DropdownButton
                    title={tokenSymbol}
                    variant='primary'
                    id='dropdown-variants-Primary'
                    key='Input-Token'
                    >
                        {tokenData.map((token, key) => {
                            return(
                                <Dropdown.Item onSelect={() => changeToken(key)} eventKey={key.toString()}>{token.symbol}</Dropdown.Item>
                            )
                        })}
                  </DropdownButton>
            </div>
        )
    }
}
