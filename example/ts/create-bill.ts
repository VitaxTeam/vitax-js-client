/**
 * example of createBill
 * VitaxTeam 2026
 *
 * npm install @vitax/js
 */

import { VitaxClient, CreateBillResponse } from "@vitax/js";

// config
const client = new VitaxClient({
  clientId: "your_client_id",
  appToken: "your_app_token",
});

async function main(): Promise<void> {
  try {
    // creating pay url(bill)
    const bill: CreateBillResponse = await client.createBill({
      amount: 50,
      toAccountId: 123,
      webhookUrl: "http://hello.world/webhook",
      returnUrl: "http://hello.world/success",
    });

    // bill data, return expiresIn(10m), billId and payUrl
    console.log("bill id:", bill.billId);
    console.log("pay url:", bill.payUrl);
  } catch (err: any) {
    console.error("err on createBill:", err.message);
  }
}

main();
