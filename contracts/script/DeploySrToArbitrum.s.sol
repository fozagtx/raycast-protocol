// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Script, console2} from "forge-std/Script.sol";
import {SenderReceiver} from "../src/SenderReceiver.sol";
import {ERC20} from "lib/solmate/src/tokens/ERC20.sol";

contract DeployContractsToArbSepolia is Script {
    ////////// CONTRACTS //////////
    SenderReceiver public senderReceiver;

    // CONSTANTS
    address ROUTER = 0x141fa059441E0ca23ce184B6A78bafD2A517DdE8;
    address LINK = 0xf97f4df75117a78c1A5a0DBb814Af92458539FB4;
    address USDC = 0xaf88d065e77c8cC2239327C5EDb3A432268e5831;
    uint64 BASE_CHAIN_ID = 15971525489660198786;
    uint64 ARBITRUM_CHAIN_ID = 4949039107694359620;

    function run() external {
        address sourceVault = vm.envAddress("SOURCE_VAULT");
        address destinationVault = vm.envAddress("DESTINATION_VAULT");

        vm.startBroadcast();

        senderReceiver = new SenderReceiver(ROUTER, LINK);

        senderReceiver.allowlistSourceChain(BASE_CHAIN_ID, true);
        senderReceiver.allowlistSender(sourceVault, true);
        senderReceiver.allowlistDestinationChain(ARBITRUM_CHAIN_ID, true);
        senderReceiver.addDestinationVault(destinationVault);
        senderReceiver.addVaultToken(USDC);
        senderReceiver.updateVaultTokenDecimals(6);
        senderReceiver.addSourceChainId(BASE_CHAIN_ID);
        senderReceiver.addSourceVault(sourceVault);

        vm.stopBroadcast();
    }
}
