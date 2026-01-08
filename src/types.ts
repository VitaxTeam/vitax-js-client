/**
 * types used in client
 * VitaxTeam 2026
 */
export interface Config {
  clientId: string;
  clientSecret?: string;
  appToken?: string;
  webhookSecret?: string;
  redirectUri?: string;
  apiUrl?: string;
}

export type Scope = "identify" | string;

export interface User {
  id: number;
  nickname: string;
  discordId?: string;
  avatarUrl?: string;
  joinedAt: string;
}

export interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface CreateBillPayload {
  amount: number;
  toAccountId: number;
  webhookUrl?: string;
  returnUrl?: string;
}

export interface CreateBillResponse {
  billId: string;
  payUrl: string;
  expiresAt: string;
}

export interface BillStatusResponse {
  id: string;
  amount: number;
  appName: string;
  appAvatar: string | null;
  status: "PENDING" | "PAID" | "EXPIRED";
  toAccountName: string;
  expiresAt: string;
  returnUrl?: string;
}

export interface WebhookPayload {
  event: "bill.paid";
  billId: string;
  amount: number;
  payerDiscordId: string;
  timestamp: number;
}
