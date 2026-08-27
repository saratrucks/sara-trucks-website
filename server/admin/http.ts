export function json(data: unknown, status = 200, extraHeaders: HeadersInit = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "same-origin",
      ...extraHeaders,
    },
  });
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  if (!origin || !host) {
    throw new Error("INVALID_ORIGIN");
  }

  const originHost = new URL(origin).host;
  if (originHost !== host) {
    throw new Error("INVALID_ORIGIN");
  }
}

export async function readJson<T>(request: Request, maxBytes = 1_500_000): Promise<T> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > maxBytes) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }

  const text = await request.text();
  if (text.length > maxBytes) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }

  return JSON.parse(text) as T;
}

export function apiError(error: unknown) {
  const code = error instanceof Error ? error.message : "UNKNOWN_ERROR";

  if (code === "INVALID_ORIGIN") return json({ error: "طلب غير موثوق." }, 403);
  if (code === "PAYLOAD_TOO_LARGE") return json({ error: "حجم البيانات أكبر من الحد المسموح." }, 413);
  if (code === "UNAUTHORIZED") return json({ error: "يجب تسجيل الدخول كمدير." }, 401);
  if (code === "NOT_CONFIGURED") return json({ error: "إعدادات الإدارة على الخادم غير مكتملة." }, 503);
  if (code === "INVALID_INPUT") return json({ error: "البيانات المدخلة غير صالحة." }, 400);

  console.error("[admin-api]", error);
  return json({ error: "تعذر إكمال العملية. حاول مرة أخرى." }, 500);
}
