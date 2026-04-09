import { generateIAMPolicy } from "./src/iamService.js";

const userInput = process.argv.slice(2).join(" ");

if (!userInput) {
  console.log('Usage: node cli.js "your request"');
  process.exit(1);
}

const context = {
  subscriptionId: "cb2f72a2-0225-4271-83e3-1d6f408cad97",
  resourceGroup: "iam-ai-project",
  storageAccount: "iam-aistorage-demo",
};

try {
  const result = await generateIAMPolicy(userInput, context);

  console.log("\n🤖 VALIDATED IAM POLICY:\n");
  console.log(JSON.stringify(result, null, 2));
} catch (err) {
  console.error("\n❌ Error generating IAM policy:");
  console.error(err.message);
}