// Irion ⟶ Stellar/Soroban config for the shopping storefront (replaces lib/sui.ts).
// Mirrors irion-core-stellar/lib/stellar.ts: network config, deployed contract
// ids, and explorer (stellar.expert) helpers. Set in .env.local for a non-default
// net: NEXT_PUBLIC_STELLAR_NETWORK=testnet
import * as StellarSdk from "@stellar/stellar-sdk";

export const NETWORK = (process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet") as
  | "testnet"
  | "mainnet";

export const STELLAR = {
  testnet: {
    rpcUrl: "https://soroban-testnet.stellar.org",
    horizonUrl: "https://horizon-testnet.stellar.org",
    networkPassphrase: StellarSdk.Networks.TESTNET,
    explorer: "https://stellar.expert/explorer/testnet",
  },
  mainnet: {
    rpcUrl: process.env.NEXT_PUBLIC_STELLAR_MAINNET_RPC_URL || "https://soroban.stellar.org",
    horizonUrl: "https://horizon.stellar.org",
    networkPassphrase: StellarSdk.Networks.PUBLIC,
    explorer: "https://stellar.expert/explorer/public",
  },
}[NETWORK];

// Deployed on Stellar testnet (see irion-contracts-stellar/deployments.testnet.json).
export const CONTRACTS = {
  irionCore:
    process.env.NEXT_PUBLIC_IRION_CORE_ID ||
    "CANPO5IPMZ44TJSSXKUI44JQJDKCXMCCHVEUE4ULWQ6XKBWU642X7W4R",
  usdc:
    process.env.NEXT_PUBLIC_USDC_ID ||
    "CA76PS5S6NRZRKPFU7GIOXPBMLI6WCXCMBH5XLCN423IIPGZS7TKCDNO",
};

export const USDC_DECIMALS = 7;
export const toUnits = (usdc: number) => BigInt(Math.round(usdc * 10 ** USDC_DECIMALS));
export const fromUnits = (units: bigint | string | number) =>
  Number(BigInt(units)) / 10 ** USDC_DECIMALS;

export const rpc = new StellarSdk.rpc.Server(STELLAR.rpcUrl);
export const explorerTx = (hash: string) => `${STELLAR.explorer}/tx/${hash}`;
export const explorerAccount = (addr: string) => `${STELLAR.explorer}/account/${addr}`;
