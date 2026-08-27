import { isAdminRequest } from "../../server/admin/auth";
import { apiError, json } from "../../server/admin/http";

export async function GET(request: Request) {
  try {
    return json({ authenticated: isAdminRequest(request) });
  } catch (error) {
    return apiError(error);
  }
}
