// Sui configuration for the XORR shopping storefront (migrated from Privy/EVM).
// Mirrors xorr-core/lib/sui.ts. Set in .env.local if you need a non-default net:
//   NEXT_PUBLIC_SUI_NETWORK=testnet

export type SuiNetwork = "testnet" | "mainnet" | "devnet" | "localnet";

export const SUI_NETWORK: SuiNetwork =
  (process.env.NEXT_PUBLIC_SUI_NETWORK as SuiNetwork) ?? "testnet";

// Hardcoded fullnode RPC URLs (the @mysten/sui 2.19 `getFullnodeUrl` helper was
// removed; these endpoints are stable and version-proof).
export const SUI_RPC_URLS: Record<SuiNetwork, string> = {
  testnet: "https://fullnode.testnet.sui.io:443",
  mainnet: "https://fullnode.mainnet.sui.io:443",
  devnet: "https://fullnode.devnet.sui.io:443",
  localnet: "http://127.0.0.1:9000",
};

export const suiscanTxUrl = (digest: string) =>
  `https://suiscan.xyz/${SUI_NETWORK}/tx/${digest}`;
