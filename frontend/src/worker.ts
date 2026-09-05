const PROFILE_IMAGE_PATH = "/images/profile/profile.png";

function getProfileWidth(request: Request): number {
  return new URL(request.url).searchParams.get("variant") === "avatar" ? 256 : 512;
}

async function serveProfileImage(request: Request, env: Env): Promise<Response> {
  const sourceUrl = new URL(PROFILE_IMAGE_PATH, request.url);
  const source = await env.ASSETS.fetch(new Request(sourceUrl));

  if (!source.ok || !source.body) {
    return source;
  }

  const optimized = (
    await env.IMAGES.input(source.body)
      .transform({ width: getProfileWidth(request), fit: "scale-down" })
      .output({ format: "image/webp", quality: 82 })
  ).response({
    headers: {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });

  if (request.method === "HEAD") {
    return new Response(null, { status: optimized.status, headers: optimized.headers });
  }

  return optimized;
}

/**
 * Handles public content that benefits from an explicit cache policy.
 * Other files continue to be delivered directly by Workers Static Assets.
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const pathname = new URL(request.url).pathname;

    if (pathname === PROFILE_IMAGE_PATH) {
      return serveProfileImage(request, env);
    }

    const response = await env.ASSETS.fetch(request);

    if (!response.ok) {
      return response;
    }

    const headers = new Headers(response.headers);

    if (pathname.startsWith("/assets/")) {
      // CV files can be replaced without leaving visitors with a stale download.
      headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    } else if (pathname.startsWith("/images/")) {
      headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    } else if (pathname.startsWith("/data/")) {
      headers.set("Cache-Control", "no-cache");
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
} satisfies ExportedHandler<Env>;
