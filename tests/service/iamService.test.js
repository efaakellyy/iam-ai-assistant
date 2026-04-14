import { jest } from "@jest/globals";

const mockCreate = jest.fn();

jest.unstable_mockModule("../../src/llm/openaiClient.js", () => ({
  client: {
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  },
}));

const { generateIAMPolicy } = await import("../../src/service/iamService.js");

describe("IAM Service", () => {
  const mockContext = {
    subscriptionId: "123",
    resourceGroup: "test-rg",
    storageAccount: "teststorage",
  };

  test("returns validated policy", async () => {
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              role: "Reader",
              scope: "/subscriptions/123/resourceGroups/test-rg",
              actions: [],
            }),
          },
        },
      ],
    });

    const result = await generateIAMPolicy("read access", mockContext);

    expect(result.role).toBe("Reader");
  });

  test("throws on overly broad scope", async () => {
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              role: "Reader",
              scope: "*",
              actions: [],
            }),
          },
        },
      ],
    });

    await expect(
      generateIAMPolicy("bad request", mockContext)
    ).rejects.toThrow("Overly broad scope detected");
  });

  test("throws on invalid scope format", async () => {
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              role: "Reader",
              scope: "invalid",
              actions: [],
            }),
          },
        },
      ],
    });

    await expect(
      generateIAMPolicy("bad request", mockContext)
    ).rejects.toThrow("Invalid scope format");
  });
});