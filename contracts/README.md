# Raycast Protocol Contracts

Foundry project for Raycast Protocol's cross-chain vault contracts.

## Build And Test

```bash
npm install
forge build
forge test
```

## Contract Map

| Path | Role |
| --- | --- |
| `src/SourceVault.sol` | Source-chain ERC4626 vault that accepts user deposits and handles source-side redemption accounting. |
| `src/SenderReceiver.sol` | Destination-chain CCIP receiver that deposits into and withdraws from `DestinationVault`. |
| `src/DestinationVault.sol` | Destination-side ERC4626 vault used by tests and deployment scripts. |
| `src/ProgrammableTokenTransfers.sol` | Shared Chainlink CCIP send, receive, allowlist, and token-transfer utilities. |
| `test/SourceVault.t.sol` | Source vault flow tests. |
| `test/UnitTests.t.sol` | Shared test setup and protocol unit tests. |

## Flow Diagram

The top-level README contains the current protocol, deposit, withdrawal, and frontend flow diagrams: [Flow diagrams](../README.md#contract-topology).

## Deployment Scripts

Raycast Protocol is Arbitrum-first. Start with the Arbitrum Sepolia source vault, then deploy the matching destination-side receiver.

Recorded Arbitrum Sepolia deployment:

| Contract | Address | Deployment tx |
| --- | --- | --- |
| `SourceVault` on Arbitrum Sepolia | `0x540dd6496ff29780458da1bab487c62f473525bf` | `0x81319a82d5a9019261527df31fbf99e7dee4df7a81bb49b682dde5bb0a33d092` |
| `DestinationVault` on Ethereum Sepolia | `0x8d089e5cf981c8c36981ba1140cc9fe68180d8b7` | `0xe2dc4a548e13768e59832659c05b00fea12fd15121f8caca27be4b1c72419d6b` |
| `SenderReceiver` on Ethereum Sepolia | `0x833d1bbf1e30894cb20bf228485a43a22fcc3e2d` | `0x243205775598daa6a53fac587d7a3b4e39715f2f0a732d48192da711f2cd5fa5` |

Recorded Arbitrum wiring:

| Action | Transaction tx |
| --- | --- |
| Allowlist Ethereum Sepolia receiver on Arbitrum SourceVault | `0x0286483613343f27c5bce2851e826432a1554895935a44229058a1fb277636fc` |
| Set SourceVault destination receiver | `0x6f27a6ff7057d4e600fb1527b156767d668804626ae2bb0f289fffe5a72c3589` |
| Set SenderReceiver destination vault | `0x17c6f46c914be08f4e546cb885703603b9db917139ca3fa545ff093d2c3e07a6` |

Current CCIP fee funding:

| Contract | Network | LINK balance | Funding tx |
| --- | --- | --- | --- |
| `SourceVault` | Arbitrum Sepolia | `25 LINK` | `0xbade64cc460b2175c6f7d27930b5baabe8d91f0fb74cce13ee36f8e61d4a3408` |
| `SenderReceiver` | Ethereum Sepolia | `25 LINK` | Chainlink faucet transfer confirmed on-chain |

| Script | Deploys |
| --- | --- |
| `script/DeploySvToArbSepolia.s.sol` | Arbitrum Sepolia `SourceVault` |
| `script/DeploySrToEthSepolia.s.sol` | Ethereum Sepolia `SenderReceiver` |
| `script/DeploySVToBaseSepolia.s.sol` | Base Sepolia `SourceVault` |
| `script/DeploySrToBaseSepolia.s.sol` | Base Sepolia `DestinationVault` and `SenderReceiver` |
| `script/DeploySvToBase.s.sol` | Base mainnet `SourceVault` |
| `script/DeploySrToArbitrum.s.sol` | Arbitrum One `SenderReceiver` |

Run deployments with a funded deployer key and the matching RPC URL:

```bash
forge script script/DeploySvToArbSepolia.s.sol:DeploySvToArb \
  --rpc-url "$ARBITRUM_SEPOLIA_RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  --broadcast
```

## Caveats

- `src/SourceVault.sol` contains an unimplemented `initSlowWithdraw` function. The queued withdrawal path currently uses `initSlowRedeem`.
- `quit()` reaches `_sendData(...)`, which is guarded by `onlyOwner`; non-owner automation callers cannot complete the cross-chain redeem path without an access-control change.
