# IAM AI Policy Assistant

## Overview

The IAM AI Policy Assistant is a system that converts natural language access requests into structured Azure RBAC policies using Azure OpenAI (GPT-4o).

The project focuses on building a **safe and reliable interface between LLMs and security-critical systems**, ensuring generated policies are valid, constrained, and usable in real-world environments.

---

## Problem

Generating IAM policies manually is time-consuming and error-prone.
LLMs can assist, but introduce risks:

* Hallucinated or invalid policy structures
* Incorrect cloud provider outputs (e.g. AWS vs Azure)
* Over-permissive or unsafe access definitions
* Low-confidence outputs from vague or ambiguous requests

This project addresses these challenges through **multi-layer validation and safety mechanisms**.

---

## Solution

The system translates natural language into Azure RBAC policies through:

1. Structured prompt engineering
2. Context injection (subscription, resource group, resource type)
3. Schema validation using Zod
4. Input validation to reject weak or ambiguous requests
5. Confidence checks to detect low-quality or generic outputs

---

## Architecture

The system is structured with clear separation of concerns:

* **CLI Layer (`src/cli/cli.js`)**
  Handles user interaction, input validation, and confidence checks

* **Service Layer (`src/service/iamService.js`)**
  Orchestrates policy generation logic

* **LLM Client (`src/llm/openaiClient.js`)**
  Handles interaction with Azure OpenAI

* **Validation Layer (`src/validation/policySchema.js`)**
  Enforces schema correctness using Zod

* **Configuration (`src/config.js`)**
  Manages environment and shared configuration

---

## Key Features

* Natural language → Azure RBAC policy generation
* Structured prompt design to enforce constraints
* Schema validation using Zod for reliable outputs
* Input validation to prevent invalid or ambiguous requests
* Confidence layer to detect and reject low-quality outputs
* Interactive CLI with continuous input loop
* Command-line flags for dynamic context configuration
* Safeguards against incorrect or cross-cloud outputs

---

## Example

**Input:**

```text
Give read access to a storage account
```

**Output (validated structure):**

```json
{
  "role": "Storage Blob Data Reader",
  "scope": "/subscriptions/.../resourceGroups/.../storageAccounts/...",
  "actions": []
}
```

---

## How to Run

```bash
# Clone the repository
git clone https://github.com/efaakellyy/iam-ai-assistant.git

# Navigate into the project
cd iam-ai-assistant

# Install dependencies
npm install

# Run the application
npm start
```

You will be prompted to enter a natural language access request.

Example:

```text
Give read access to a storage account
```

---

## Command Line Options

You can override the default Azure context using flags:

```bash
npm start -- --resourceGroup my-rg
```

Available flags:

* `--subscriptionId`
* `--resourceGroup`
* `--storageAccount`

Example:

```bash
npm start -- --subscriptionId 123 --resourceGroup test-rg --storageAccount mystorage
```

---

## Validation & Safety

The system uses multiple layers to ensure safe and reliable outputs:

* **Schema Validation (Zod)**
  Ensures outputs follow a strict structure

* **Input Validation**
  Rejects vague or invalid user requests

* **Semantic Checks**
  Ensures requests contain meaningful access intent

* **Confidence Layer**
  Detects low-quality or generic outputs and prompts the user to refine their request

---

## Key Engineering Challenges

* Ensuring **structured and deterministic outputs** from a probabilistic model
* Preventing **invalid or unsafe IAM policies**
* Handling **ambiguous or low-quality user input**
* Designing a system that balances **flexibility with safety constraints**

---

## Future Improvements

* REST API interface for integration into applications
* Policy explanation and reasoning output
* Expanded support for additional Azure resources
* Integration with live Azure environments for validation
* Containerisation using Docker to support consistent environments and future deployment as a service

---

## Tech Stack

* JavaScript (Node.js)
* Azure OpenAI (GPT-4o)
* Azure RBAC
* Zod (schema validation)

---

## Author

Aoife Kelly
GitHub: https://github.com/efaakellyy
