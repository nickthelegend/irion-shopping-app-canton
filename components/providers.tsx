"use client"

import type React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SuiClientProvider, WalletProvider, createNetworkConfig } from "@mysten/dapp-kit"
import "@mysten/dapp-kit/dist/index.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { SUI_NETWORK, SUI_RPC_URLS } from "@/lib/sui"

// Sui networks for @mysten/dapp-kit. Each entry MUST include `network` — the
// SuiJsonRpcClientOptions type requires it (not just { url }).
const { networkConfig } = createNetworkConfig({
    testnet: { url: SUI_RPC_URLS.testnet, network: "testnet" },
    mainnet: { url: SUI_RPC_URLS.mainnet, network: "mainnet" },
    devnet: { url: SUI_RPC_URLS.devnet, network: "devnet" },
    localnet: { url: SUI_RPC_URLS.localnet, network: "localnet" },
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig} defaultNetwork={SUI_NETWORK}>
                <WalletProvider autoConnect>
                    {children}
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                    />
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    )
}
