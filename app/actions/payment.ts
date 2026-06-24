"use server"

// Demo merchant escrow on Sui (USDC v3 MerchantEscrow). Public, non-secret.
const DEMO_ESCROW = "0x44945bd13ef548fd3beb77c6d111bdfd88e549a3650a9caa7213d527d4e59c0c";
const CORE_URL = process.env.POLARIS_CORE_URL || "https://app.xorr.finance";

export async function initiatePolarisPayment(
    amount: number,
    description: string,
): Promise<{ checkoutUrl?: string; error?: string }> {
    const clientId = process.env.POLARIS_CLIENT_ID;
    const clientSecret = process.env.POLARIS_CLIENT_SECRET;
    const apiUrl = process.env.MERCHANT_API_URL || "https://merchants.xorr.finance/api/bills/create";

    // Mongo-free direct settlement URL — always works (the /pay page reads these
    // params when there's no DB bill). Used as the fallback whenever the merchant
    // API / database is unavailable, so checkout is never hard-blocked on Mongo.
    const directUrl = () => {
        const p = new URLSearchParams({
            amount: String(amount),
            escrow: DEMO_ESCROW,
            merchant: "XORR Demo Shop",
            desc: description,
        });
        return `${CORE_URL}/pay/direct?${p.toString()}`;
    };

    // No API credentials → go straight to direct settlement.
    if (!clientId || !clientSecret) {
        return { checkoutUrl: directUrl() };
    }

    try {
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-client-id": clientId,
                "x-client-secret": clientSecret,
            },
            body: JSON.stringify({
                amount,
                description,
                metadata: { source: "XORR_Demo_Shop", order_date: new Date().toISOString() },
            }),
        });
        const data = await res.json().catch(() => ({}));
        // Any failure (bad creds, DB down, etc.) → fall back to direct settlement.
        if (!res.ok || data.error || !data.checkoutUrl) return { checkoutUrl: directUrl() };
        return { checkoutUrl: data.checkoutUrl };
    } catch (e) {
        console.error("Merchant API unreachable, using direct settlement:", e);
        return { checkoutUrl: directUrl() };
    }
}
