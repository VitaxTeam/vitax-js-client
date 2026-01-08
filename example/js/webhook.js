/**
 * example of webhook
 * VitaxTeam 2026
 *
 * npm install express @vitax/js
 */
const express = require("express");
const { VitaxClient } = require("@vitax/js");

const app = express();
// config
const client = new VitaxClient({
  clientId: "YOUR_CLIENT_ID",
  webhookSecret: "whsec_YOUR_SECRET",
});

// raw body parser middleware
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.post("/webhook", (req, res) => {
  const signature = req.headers["x-signature"];

  try {
    // verify signature
    const isValid = client.verifyWebhookSignature(req.rawBody, signature);

    if (!isValid) return res.status(403).send("invalid signature");

    const event = req.body;
    // bill.paid event
    if (event.event === "bill.paid") {
      console.log(
        `bill: ${event.billId}, paid discordId: ${event.payerDiscordId}`
      );
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("err on webhook processing");
  }
});

app.listen(3000);
