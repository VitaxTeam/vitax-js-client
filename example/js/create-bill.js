/**
 * example of createBill
 * VitaxTeam 2026
 *
 * npm install @vitax/js
 */

const { VitaxClient } = require("@vitax/js");

// config
const client = new VitaxClient({
  clientId: "yourclientid",
  appToken: "yourapptoken",
});

async function main() {
  try {
    // creating pay url(bill)
    const bill = await client.createBill({
      amount: 50,
      toAccountId: 123,
      webhookUrl: "http://hello.world/webhook",
      returnUrl: "http://hello.world/success",
    });

    // bill data, return expiresIn(10m), billId and payUrl
    console.log("bill data:", bill.billId);
    console.log("pay url:", bill.payUrl);
  } catch (err) {
    console.error("err on createBill:", err.message);
  }
}

main();
