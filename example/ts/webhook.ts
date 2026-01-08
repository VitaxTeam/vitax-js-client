/**
 * example of webhook
 * VitaxTeam 2026
 *
 * npm install express @vitax/js @types/express
 */
import express, { Request, Response } from "express";
import { VitaxClient, WebhookPayload } from "@vitax/js";

// Extend Express Request to include rawBody
interface RawBodyRequest extends Request {
  rawBody?: string;
}

const app = express();
const PORT = 3000;

// config
const client = new VitaxClient({
  clientId: "your_client_id",
  webhookSecret: "whsec_your_secret",
});

// raw body parser middleware
app.use(
  express.json({
    verify: (req: RawBodyRequest, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.post("/webhook", (req: RawBodyRequest, res: Response) => {
  const signature = req.headers["x-signature"] as string;

  if (!req.rawBody || !signature) {
    return res.status(400).send("Missing body or signature");
  }

  try {
    // verify signature
    const isValid = client.verifyWebhookSignature(req.rawBody, signature);

    if (!isValid) return res.status(403).send("invalid signature");

    const event = req.body as WebhookPayload;

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

app.listen(PORT, () => console.log(`Webhook server running on port ${PORT}`));
