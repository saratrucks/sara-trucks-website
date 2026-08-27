import { requireAdmin } from "../../server/admin/auth.js";
import { type Catalog, uploadPath } from "../../server/admin/catalogs.js";
import { putRepositoryFile } from "../../server/admin/github.js";
import { apiError, assertSameOrigin, json } from "../../server/admin/http.js";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const catalogs = new Set<Catalog>(["trucks", "trailers", "equipment"]);

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    requireAdmin(request);
    const formData = await request.formData();
    const file = formData.get("image");
    const catalog = formData.get("catalog");
    const itemId = Number(formData.get("itemId"));

    if (!(file instanceof File) || typeof catalog !== "string" || !catalogs.has(catalog as Catalog)) {
      throw new Error("INVALID_INPUT");
    }
    if (file.size < 1 || file.size > MAX_IMAGE_BYTES) throw new Error("PAYLOAD_TOO_LARGE");

    const path = uploadPath(catalog as Catalog, itemId, file.type);
    await putRepositoryFile(path, Buffer.from(await file.arrayBuffer()), `Admin: upload ${catalog} image`);
    const publicPath = path.replace("client/public", "");
    return json({ uploaded: true, url: publicPath, deploymentPending: true });
  } catch (error) {
    return apiError(error);
  }
}
