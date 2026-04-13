import readline from "readline";
import { generateIAMPolicy } from "../service/iamService.js";

// Parse command-line arguments
const args = process.argv.slice(2);

const getArgValue = (flag) => {
  const index = args.indexOf(flag);
  return index !== -1 ? args[index + 1] : null;
};

// Default context (can be overridden by flags)
const context = {
  subscriptionId:
    getArgValue("--subscriptionId") ||
    "cb2f72a2-0225-4271-83e3-1d6f408cad97",

  resourceGroup:
    getArgValue("--resourceGroup") || "iam-ai-project",

  storageAccount:
    getArgValue("--storageAccount") || "iam-aistorage-demo",
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("IAM AI Policy Assistant\n");

console.log("Using context:");
console.log(JSON.stringify(context, null, 2));
console.log("\n-----------------------------\n");

// Input validation
function isValidInput(input) {
  const trimmed = input.trim().toLowerCase();

  if (trimmed.length < 10) return false;

  const keywords = ["access", "read", "write", "role", "permission"];
  return keywords.some((word) => trimmed.includes(word));
}

// Confidence check
function isLowConfidence(input, result) {
  const trimmed = input.trim().toLowerCase();

  // Very short / vague input
  if (trimmed.length < 15) return true;

  // Generic fallback role from model
  if (result.role === "Reader") return true;

  return false;
}

function ask() {
  rl.question(
    "Enter access request (or type 'exit' to quit): ",
    async (userInput) => {
      if (userInput.toLowerCase() === "exit") {
        console.log("Goodbye!");
        rl.close();
        return;
      }

      // Input validation
      if (!isValidInput(userInput)) {
        console.log(
          "\n Please enter a clear access request.\n"
        );
        return ask();
      }

      try {
        const result = await generateIAMPolicy(userInput, context);

        // Structural check
        if (!result || !result.role || !result.scope) {
          throw new Error("Invalid policy generated");
        }

        // Confidence check
        if (isLowConfidence(userInput, result)) {
          console.log("\n Low confidence result detected.");
          console.log(
            "The request may be too vague or resulted in a generic policy."
          );
          console.log(
            "Try being more specific (e.g. include resource type or permission level).\n"
          );
          return ask();
        }

        console.log("\n VALIDATED IAM POLICY:\n");
        console.log(JSON.stringify(result, null, 2));
        console.log("\n-----------------------------\n");
      } catch (err) {
        console.error("\n Error generating IAM policy:");
        console.error(err.message);
        console.log("\n-----------------------------\n");
      }

      ask(); 
    }
  );
}

ask();