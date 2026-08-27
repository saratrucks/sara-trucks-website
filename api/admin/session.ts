import { isAdminRequest } from "../../server/admin/auth.js";
import { apiError, json } from "../../server/admin/http.js";

export async function GET(request: Request) {
  try {
    return json({ authenticated: isAdminRequest(request) });
  } catch (error) {
    return apiError(error);
  }
}
