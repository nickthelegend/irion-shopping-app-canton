"use server"

// Demo merchant settlement on Stellar. The deployer/escrow account that receives
// the demo storefront's settlements (public, non-secret).
const DEMO_ESCROW = "GBKZC3N4UVFZ54CAM7I26NWIDQLQJVPPUVDNLDBAS5PC3BAUA3GYOYXR";
// Accept the new IRION_CORE_URL; fall back to the old POLARIS_CORE_URL for back-compat.
const CORE_URL =
    process.env.IRION_CORE_URL || process.env.POLARIS_CORE_URL || "http://localhost:3000";

export async function initiateIrionPayment(
    amount: number,
    description: string,
): Promise<{ checkoutUrl?: string; error?: string }> {
    const clientId = process.env.IRION_CLIENT_ID || process.env.POLARIS_CLIENT_ID;
    const clientSecret = process.env.IRION_CLIENT_SECRET || process.env.POLARIS_CLIENT_SECRET;
    const apiUrl =
        process.env.MERCHANT_API_URL || "https://merchants.irion.finance/api/bills/create";

    // DB-free direct settlement URL — always works (the /pay page reads these
    // params when there's no DB bill). Used as the fallback whenever the merchant
    // API / database is unavailable, so checkout is never hard-blocked.
    const directUrl = () => {
        const p = new URLSearchParams({
            amount: String(amount),
            escrow: DEMO_ESCROW,
            to: DEMO_ESCROW,
            merchant: "Irion Demo Shop",
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
                metadata: { source: "Irion_Demo_Shop", order_date: new Date().toISOString() },
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
