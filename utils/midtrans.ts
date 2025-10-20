import { CartItem } from "../types";

// ===================================================================================
// !!! IMPORTANT SECURITY WARNING !!!
// 
// This file is a FRONTEND SIMULATION of a backend server.
// In a real-world application, this logic MUST exist on a secure server (e.g., Node.js, Go, PHP).
// Your Midtrans Server Key MUST NEVER be exposed in frontend code.
//
// The flow should be:
// 1. Frontend sends order details to YOUR backend.
// 2. YOUR backend uses the Midtrans library and your Server Key to create a transaction.
// 3. YOUR backend receives a transaction token from Midtrans.
// 4. YOUR backend sends ONLY the token back to the frontend.
// 5. Frontend uses the token with snap.pay().
// ===================================================================================

interface TransactionDetails {
    totalAmount: number;
    customerDetails: { name: string; phone: string; };
    cartItems: CartItem[];
}

/**
 * **MOCK FUNCTION:** Simulates calling your backend to create a Midtrans transaction.
 * @param details - The details of the order.
 * @returns A promise that resolves with a mock transaction token.
 */
export const createMidtransTransaction = (details: TransactionDetails): Promise<{ token: string }> => {
    console.log("SIMULATING: Calling backend to create Midtrans transaction with details:", details);

    return new Promise((resolve) => {
        // Simulate network latency
        setTimeout(() => {
            // In a real backend, you would use the midtrans-client library here
            // to call `snap.createTransaction(parameter)` and get a real token.
            // For this simulation, we'll just generate a fake token.
            const mockOrderId = `order-${Date.now()}`;
            const mockTransactionToken = `MOCK-TOKEN-${mockOrderId}-${Math.random().toString(36).substring(2)}`;
            
            console.log("SIMULATING: Backend received mock token from Midtrans:", mockTransactionToken);

            resolve({ token: mockTransactionToken });
        }, 1500); // 1.5-second delay to simulate a server call
    });
};
