/**
 * example of oauth
 * VitaxTeam 2026
 *
 * npm install express @vitax/js
 */

const express = require("express");
const { VitaxClient } = require("@vitax/js");

const app = express();
// config
const client = new VitaxClient({
  clientId: "yourclientid",
  clientSecret: "yourclientsecret",
  redirectUri: "http://hello.world/callback",
});

app.get("/login", (req, res) => {
  // get authorize url
  const url = client.getAuthorizeUrl(["identify"]); // identify - get user info scope
  res.redirect(url);
});

app.get("/callback", async (req, res) => {
  const { code } = req.query;

  try {
    // exchange code to token
    const token = await client.exchangeCode(code);
    // get user info(id, username, etc)
    const user = await client.getUser(token.access_token);

    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000);
