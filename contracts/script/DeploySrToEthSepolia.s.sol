// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Script, console2} from "forge-std/Script.sol";
import {SenderReceiver} from "../src/SenderReceiver.sol";
import {ERC20} from "lib/solmate/src/tokens/ERC20.sol";

contract DeployContractsToArbSepolia is Script {
    ////////// CONTRACTS //////////
    SenderReceiver public senderReceiver;

    // CONSTANTS
    address ROUTER = 0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59;
    address LINK = 0x779877A7B0D9E8603169DdbD7836e478b4624789;
    address USDC = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238;
    uint64 ARB_SEPOLIA_CHAIN_ID = 3478487238524512106;
    uint64 ETH_SEPOLIA_CHAIN_ID = 16015286601757825753;

    // Change this to the address of the SourceVault
    address SOURCE_VAULT = 0x540dd6496FF29780458Da1bAb487C62F473525BF;
    address DESTINATION_VAULT = 0x8d089e5Cf981c8C36981ba1140Cc9FE68180D8b7;

    function run() external {
        vm.startBroadcast();

        senderReceiver = new SenderReceiver(ROUTER, LINK);

        senderReceiver.allowlistSourceChain(ARB_SEPOLIA_CHAIN_ID, true);
        senderReceiver.allowlistSender(SOURCE_VAULT, true);
        senderReceiver.allowlistDestinationChain(ARB_SEPOLIA_CHAIN_ID, true);
        senderReceiver.addDestinationVault(address(DESTINATION_VAULT)); // SOMMELIER
        senderReceiver.addVaultToken(USDC);
        senderReceiver.updateVaultTokenDecimals(6);
        senderReceiver.addSourceChainId(ARB_SEPOLIA_CHAIN_ID);
        senderReceiver.addSourceVault(SOURCE_VAULT);

        vm.stopBroadcast();
    }
}
