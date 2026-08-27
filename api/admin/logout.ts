import { clearSessionCookie } from "../../server/admin/auth";
import { apiError, assertSameOrigin, json } from "../../server/admin/http";

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
