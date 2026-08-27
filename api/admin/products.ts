import { requireAdmin } from "../../server/admin/auth.js";
import { type Catalog, saveCatalog } from "../../server/admin/catalogs.js";
import { apiError, assertSameOrigin, json, readJson } from "../../server/admin/http.js";

type SavePayload = {
  catalog?: Catalog;
  items?: unknown;
};

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    requireAdmin(request);
    const body = await readJson<SavePayload>(request);
    if (!body.catalog) throw new Error("INVALID_INPUT");
    const items = await saveCatalog(body.catalog, body.items);
    return json({ saved: true, items, deploymentPending: true });
  } catch (error) {
    return apiError(error);
  }
}
