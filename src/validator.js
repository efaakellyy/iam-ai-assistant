import { z } from "zod";

export const iamSchema = z.object({
  role: z.string().min(1),
  scope: z.string().min(1),
  actions: z.array(z.string()).nullable(),
});

export function validateIAMPolicy(data) {
  try {
    const parsed = typeof data === "string"
      ? JSON.parse(data)
      : data;

    return iamSchema.parse(parsed);
  } catch (err) {
    throw new Error("Invalid IAM policy output from model");
  }
}