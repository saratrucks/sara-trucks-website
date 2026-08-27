import { clearSessionCookie } from "../../server/admin/auth.js";
import { apiError, assertSameOrigin, json } from "../../server/admin/http.js";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    return json(
      { authenticated: false },
      200,
      { "Set-Cookie": clearSessionCookie() },
    );
  } catch (error) {
    return apiError(error);
  }
}
