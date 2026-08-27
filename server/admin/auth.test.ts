import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createSessionCookie, isAdminRequest, verifyPassword } from "./auth";

describe("admin authentication", () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = "Strong-admin-password-2026";
    process.env.ADMIN_SESSION_SECRET = "session-secret-with-more-than-thirty-two-characters";
  });

  afterEach(() => {
    delete process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_SESSION_SECRET;
  });

  it("compares the configured password without exposing it to the client", () => {
    expect(verifyPassword("Strong-admin-password-2026")).toBe(true);
    expect(verifyPassword("incorrect-password")).toBe(false);
  });

  it("accepts a valid signed admin session cookie", () => {
    const cookie = createSessionCookie().split(";")[0];
    const request = new Request("https://www.sara-trucks.com/api/admin/session", {
      headers: { cookie },
    });
    expect(isAdminRequest(request)).toBe(true);
  });

  it("rejects a tampered session cookie", () => {
    const cookie = createSessionCookie().split(";")[0];
    const request = new Request("https://www.sara-trucks.com/api/admin/session", {
      headers: { cookie: `${cookie}tampered` },
    });
    expect(isAdminRequest(request)).toBe(false);
  });
});
