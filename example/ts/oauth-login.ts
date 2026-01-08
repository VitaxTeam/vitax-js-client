/**
 * example of oauth
 * VitaxTeam 2026
 *
 * npm install express @vitax/js @types/express
 */

import express, { Request, Response } from "express";
import { VitaxClient } from "@vitax/js";

const app = express();
const PORT = 3000;

// config
const client = new VitaxClient({
  clientId: "your_client_id",
  clientSecret: "your_client_secret",
  redirectUri: `http://localhost:${PORT}/callback`,
});

app.get("/login", (req: Request, res: Response) => {
  // get authorize url
  const url = client.getAuthorizeUrl(["identify"]); // identify - get user info scope
  res.redirect(url);
});

app.get("/callback", async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code || typeof code !== "string") {
    return res.status(400).send("No code provided");
  }

  try {
    // exchange code to token
    const token = await client.exchangeCode(code);
    // get user info(id, username, etc)
    const user = await client.getUser(token.access_token);

    res.json({ user, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
