import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { POST } from "../../api/admin/login";

describe("POST /api/admin/login", () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = "Strong-admin-password-2026";
    process.env.ADMIN_SESSION_SECRET = "session-secret-with-more-than-thirty-two-characters";
  });

  afterEach(() => {
    delete process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_SESSION_SECRET;
  });

  it("returns an HttpOnly strict cookie for the correct password", async () => {
    const response = await POST(new Request("https://www.sara-trucks.com/api/admin/login", {
      method: "POST",
      headers: {
        origin: "https://www.sara-trucks.com",
        host: "www.sara-trucks.com",
        "content-type": "application/json",
      },
      body: JSON.stringify({ password: "Strong-admin-password-2026" }),
    }));

    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toContain("SameSite=Strict");
  });

  it("rejects invalid origins before checking credentials", async () => {
    const response = await POST(new Request("https://www.sara-trucks.com/api/admin/login", {
      method: "POST",
      headers: {
        origin: "https://attacker.example",
        host: "www.sara-trucks.com",
        "content-type": "application/json",
      },
      body: JSON.stringify({ password: "Strong-admin-password-2026" }),
    }));

    expect(response.status).toBe(403);
  });
});
