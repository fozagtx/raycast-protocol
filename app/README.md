# Raycast Protocol App

Next.js interface for the Raycast Protocol cross-chain vault flow.

The active source vault, USDC token, and supported chains are configured in `src/app/config.ts`.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Testing A Flow

1. Update `src/app/config.ts` for the chain you want to use.
2. Connect a wallet on one of the configured chains.
3. Pick a vault and enter an amount.
4. Approve USDC for deposits or source vault shares for withdrawals.
5. Submit the deposit or withdrawal transaction.

The top-level README contains the protocol and frontend flow diagrams: [Flow diagrams](../README.md#contract-topology).

## Deploy

```bash
vercel
```
