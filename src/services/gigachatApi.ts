/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";
import type { RequirementAnalysis } from "../types";
import { parseAiResponse } from "../utils.ts/responseParser";
import { SYSTEM_PROMPT } from "../constants";
import { MOCKS } from "../constants/mocks";

interface GigaChatToken {
  access_token: string;
  expires_at: number;
}

interface GigaChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GigaChatRequest {
  model: string;
  messages: GigaChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface GigaChatChoice {
  message: {
    role: string;
    content: string;
  };
  index: number;
  finish_reason: string;
}

interface GigaChatResponse {
  choices: GigaChatChoice[];
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const TModels = {
  lite: "GigaChat-2",
  pro: "GigaChat-2-Pro",
  max: "GigaChat-2-Max",
  liteLegacy: "GigaChat",
  proLegacy: "GigaChat-Pro",
  maxLegacy: "GigaChat-Max",
} as const;

export type TModel = (typeof TModels)[keyof typeof TModels];

export type TModels = typeof TModels;

class GigaChatAPI {
  private token: string | null = null;
  private tokenExpiry: number = 0;

  private readonly AUTH_URL = "/api/v2/oauth";
  private readonly BASE_URL = "/gigachat-api";
  private readonly MODEL = TModels.pro;

  private get authKey(): string {
    const key = import.meta.env.VITE_GIGACHAT_AUTH_KEY;
    if (!key) {
      throw new Error(
        "VITE_GIGACHAT_AUTH_KEY не найден в переменных окружения"
      );
    }
    return key;
  }

  private get scope(): string {
    return import.meta.env.VITE_GIGACHAT_SCOPE || "GIGACHAT_API_PERS";
  }

  private isTokenValid(): boolean {
    return this.token !== null && Date.now() < this.tokenExpiry * 1000;
  }

  private async getToken(): Promise<string> {
    if (this.isTokenValid()) {
      return this.token!;
    }

    console.log("=== ПОЛУЧЕНИЕ ТОКЕНА GIGACHAT ===");

    try {
      const response = await fetch(this.AUTH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          RqUID: uuidv4(),
          Authorization: `Basic ${this.authKey}`,
        },
        body: `scope=${this.scope}`,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка авторизации: ${response.status} ${errorText}`);
      }

      const data: GigaChatToken = await response.json();
      this.token = data.access_token;
      this.tokenExpiry = data.expires_at;

      console.log(
        "Токен успешно получен, истекает:",
        new Date(data.expires_at * 1000)
      );
      return this.token;
    } catch (error) {
      console.error("Ошибка получения токена:", error);
      throw error;
    }
  }

  private async sendRequest(messages: GigaChatMessage[]): Promise<string> {
    const token = await this.getToken();

    const requestBody: GigaChatRequest = {
      model: this.MODEL,
      messages,
      temperature: 0.87,
      max_tokens: 2048,
    };

    console.log("=== ОТПРАВКА ЗАПРОСА В GIGACHAT ===");
    console.log("Модель:", this.MODEL);
    console.log("Сообщения:", messages);

    try {
      const response = await fetch(`${this.BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Ошибка API:", response.status, errorText);
        throw new Error(`Ошибка GigaChat API: ${response.status} ${errorText}`);
      }

      const data: GigaChatResponse = await response.json();
      console.log("=== ОТВЕТ ОТ GIGACHAT ===");
      console.log("Использование токенов:", data.usage);

      const content = data.choices[0]?.message?.content;
      if (!content) {
        throw new Error("Пустой ответ от модели");
      }

      console.log("Ответ модели:", content);
      return content;
    } catch (error) {
      console.error("Ошибка запроса к GigaChat:", error);
      throw error;
    }
  }

  private parseAnalysisResponse(response: string): RequirementAnalysis {
    return parseAiResponse(response);
  }

  public async analyzeRequirement(
    requirement: string
  ): Promise<RequirementAnalysis> {
    const messages: GigaChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: requirement },
    ];

    try {
      const response = await this.sendRequest(messages);
      // const response = MOCKS.response_1;

      const result = this.parseAnalysisResponse(response);
      return result;
    } catch (error) {
      console.error("Ошибка анализа требования:", error);
      throw new Error(
        `Не удалось проанализировать требование: ${
          error instanceof Error ? error.message : "Неизвестная ошибка"
        }`
      );
    }
  }

  public async sendChatMessage(messages: GigaChatMessage[]): Promise<string> {
    try {
      return await this.sendRequest(messages);
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
      throw new Error(
        `Не удалось отправить сообщение: ${
          error instanceof Error ? error.message : "Неизвестная ошибка"
        }`
      );
    }
  }

  public async getModels(): Promise<any> {
    const token = await this.getToken();

    try {
      const response = await fetch(`${this.BASE_URL}/models`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка получения моделей: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Ошибка получения моделей:", error);
      throw error;
    }
  }
}

// Экспортируем единственный экземпляр
export const gigachatApi = new GigaChatAPI();
