import OpenAI from "openai";
import { config } from "../config.js";

export const client = new OpenAI({
  apiKey: config.apiKey,
  baseURL: `${config.endpoint}/openai/deployments/${config.deployment}`,
  defaultQuery: { "api-version": config.apiVersion },
  defaultHeaders: {
    "api-key": config.apiKey,
  },
});