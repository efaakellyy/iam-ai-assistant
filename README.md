# IAM AI Assistant (Azure OpenAI + RBAC Policy Generator)

An AI-powered IAM policy generator that converts natural language access requests into structured **Azure RBAC policies** using Azure OpenAI (GPT-4o).

This project demonstrates **LLM system design, prompt engineering, cloud integration, and IAM security modelling**.

---

## What it does

This tool takes a natural language request like:

> "Give finance team read access to storage"

and converts it into a valid Azure IAM policy:

```json
{
  "role": "Storage Blob Data Reader",
  "scope": "/subscriptions/.../resourceGroups/.../storageAccounts/...",
  "actions": []
}