/**
 * the heart of client
 * VitaxTeam 2026
 */
import {
  Config,
  Scope,
  AccessTokenResponse,
  User,
  CreateBillPayload,
  CreateBillResponse,
  BillStatusResponse,
} from "./types";
import { VitaxError } from "./error";
import * as crypto from "crypto";

export * from "./types";
export * from "./error";

/**
 * Клиент для взаимодействия с Vitax API.
 */
export class VitaxClient {
  private baseUrl: string;

  constructor(private config: Config) {
    this.baseUrl = config.apiUrl || "https://api.vitax.su/api";
  }

  /**
   * Генерация URL для авторизации пользователя.
   * @param scopes - Запрашиваемые права доступа.
   * @param state - (Опционально) Параметр состояния для защиты от CSRF.
   */
  public getAuthorizeUrl(
    scopes: Scope[] = ["identify"],
    state?: string
  ): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri || "",
      response_type: "code",
      scope: scopes.join(","),
    });

    if (state) {
      params.append("state", state);
    }

    return `https://vitax.su/oauth/authorize?${params.toString()}`;
  }

  /**
   * Обмен кода авторизации на токен доступа.
   * @param code - Код авторизации, полученный после успешной авторизации пользователя.
   * @return Токен доступа и информация о нем.
   */
  public async exchangeCode(code: string): Promise<AccessTokenResponse> {
    if (!this.config.clientSecret) {
      throw new VitaxError("clientSecret is required for token exchange");
    }

    return this.request<AccessTokenResponse>("/oauth2/token", {
      method: "POST",
      body: JSON.stringify({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: this.config.redirectUri,
      }),
    });
  }

  /**
   * Получение информации о пользователе.
   * @param accessToken - Токен доступа пользователя.
   * @return Информация о пользователе.
   */
  public async getUser(accessToken: string): Promise<User> {
    return this.request<User>("/public/users/@me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Создание счета на оплату.
   * @param payload - Данные для создания счета.
   * @return Информация о созданном счете.
   */
  public async createBill(
    payload: CreateBillPayload
  ): Promise<CreateBillResponse> {
    if (!this.config.appToken) {
      throw new VitaxError("appToken is required for creating bills");
    }

    return this.request<CreateBillResponse>("/billing/create", {
      method: "POST",
      headers: {
        "X-Client-Id": this.config.clientId,
        Authorization: `Bearer ${this.config.appToken}`,
      },
      body: JSON.stringify(payload),
    });
  }

  /**
   * Получение статуса счета.
   * @param billId - Идентификатор счета.
   * @return Статус счета.
   */
  public async getBill(billId: string): Promise<BillStatusResponse> {
    return this.request<BillStatusResponse>(`/billing/${billId}`, {
      method: "GET",
    });
  }

  /**
   * Проверка подписи вебхука.
   * @param payload - Тело запроса (строка или объект).
   * @param signature - Подпись из заголовка X-Signature.
   * @param secret - (Опционально) Webhook Secret. Если не передан, берется из конфига.
   */
  public verifyWebhookSignature(
    payload: string | object,
    signature: string,
    secret?: string
  ): boolean {
    const secretKey = secret || this.config.webhookSecret;

    if (!secretKey) {
      throw new VitaxError(
        "Webhook secret is required. Provide it in constructor config or as argument."
      );
    }

    const data =
      typeof payload === "string" ? payload : JSON.stringify(payload);

    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(data)
      .digest("hex");

    return hash === signature;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new VitaxError(
        data?.message || response.statusText,
        response.status,
        data
      );
    }

    return data as T;
  }
}
