import { validateIAMPolicy } from "../../src/validation/policySchema.js";

describe("IAM Policy Validation", () => {
  test("should validate a correct policy", () => {
    const input = JSON.stringify({
      role: "Reader",
      scope: "/subscriptions/123/resourceGroups/test",
      actions: []
    });

    const result = validateIAMPolicy(input);

    expect(result.role).toBe("Reader");
    expect(result.scope).toContain("/subscriptions/");
  });

  test("should throw on invalid JSON", () => {
    const input = "invalid json";

    expect(() => validateIAMPolicy(input)).toThrow();
  });

  test("should throw if required fields are missing", () => {
    const input = JSON.stringify({
      role: "Reader"
    });

    expect(() => validateIAMPolicy(input)).toThrow();
  });
});