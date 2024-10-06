// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin Contracts
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PupaToken
 * @dev ERC20 Token with ownership functionality.
 */
contract PupaToken is ERC20, Ownable {
    /**
     * @dev Constructor that initializes the ERC20 token and mints an initial supply to the deployer.
     * @param name_ Name of the token.
     * @param symbol_ Symbol of the token.
     */
    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {
        // Mint an initial supply to the deployer
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    /**
     * @dev Function to mint new tokens, restricted to the contract owner.
     * @param to The address receiving the minted tokens.
     * @param amount The number of tokens to mint.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
