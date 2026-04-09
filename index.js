import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
    defaultQuery: { "api-version": "2024-02-15-preview" },
    defaultHeaders: {
        "api-key": process.env.AZURE_OPENAI_API_KEY,
    },
});

async function run() {

    const userInput = "Give read-only access to finance reports for analysts";
    const context = {
        subscriptionId: "cb2f72a2-0225-4271-83e3-1d6f408cad97",
        resourceGroup: "iam-ai-project",
        storageAccount: "iam-aistorage-demo"
    };

    const response = await client.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `
        You are an Azure IAM policy generator.
        
        Your job is to translate natural language into Azure RBAC-compatible access definitions.
        
        Rules:
        - Use real Azure built-in roles (Reader, Contributor, Owner, Storage Blob Data Reader, etc.)
        - Always generate a valid Azure resource scope in ARM format
        - Do NOT use AWS IAM concepts
        - Only include "actions" when the request requires a custom role
        - If a built-in role is used, set "actions" to null (not an empty array)
        - Output ONLY valid JSON
        - Do NOT include explanations or markdown
        
        Return format:
        {
          "role": "",
          "scope": "",
          "actions": null
        }
        `,
            },
            {
                role: "user",
                content: `
         Generate an Azure IAM policy for the following real environment:

         Subscription ID: ${context.subscriptionId}
         Resource Group: ${context.resourceGroup}
         Storage Account: ${context.storageAccount}

    Request: ${userInput}
      `,
            },
        ],
        max_tokens: 200,
    });

    console.log("\n🤖 IAM POLICY RESULT:\n");
    console.log(response.choices[0].message.content);
}

run();