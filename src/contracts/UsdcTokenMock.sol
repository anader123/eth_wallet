pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";

contract UsdcTokenMock is ERC20Mintable {
  string public name;
  string public symbol;
  uint256 public decimals;

  constructor() public {
    name = 'USD Coin';
    symbol = 'USDC';
    decimals = 6;
  }
}