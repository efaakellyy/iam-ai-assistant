import { client } from "./client.js";
import { validateIAMPolicy } from "./validator.js";

const SYSTEM_PROMPT = `
You are an Azure IAM policy generator.

You convert natural language into Azure RBAC policy definitions.

STRICT RULES:
- Use only valid Azure RBAC roles (Reader, Contributor, Storage Blob Data Reader, etc.)
- Always output valid JSON
- Never use AWS IAM concepts
- Always produce real Azure ARM resource scopes
- Do not include explanations or markdown

OUTPUT FORMAT:
{
  "role": "",
  "scope": "",
  "actions": []
}
`;

export async function generateIAMPolicy(userInput, context) {
  const response = await client.chat.completions.create({
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `
    Generate an Azure IAM policy for this environment:

    Subscription ID: ${context.subscriptionId}
    Resource Group: ${context.resourceGroup}
    Storage Account: ${context.storageAccount}

Request: ${userInput}
        `,
      },
    ],
    max_tokens: 300,
  });

  const raw = response.choices[0].message.content;

  const validated = validateIAMPolicy(raw);

  return validated;
}