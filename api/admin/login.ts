import { createSessionCookie, verifyPassword } from "../../server/admin/auth.js";
import { apiError, assertSameOrigin, json, readJson } from "../../server/admin/http.js";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await readJson<{ password?: unknown }>(request, 5_000);
    const password = typeof body.password === "string" ? body.password : "";

    if (!verifyPassword(password)) {
      return json({ error: "كلمة المرور غير صحيحة." }, 401);
    }

    return json(
      { authenticated: true },
      200,
      { "Set-Cookie": createSessionCookie() },
    );
  } catch (error) {
    return apiError(error);
  }
}
