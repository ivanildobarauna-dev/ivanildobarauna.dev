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
  ).response();

  if (request.method === "HEAD") {
    return new Response(null, { status: optimized.status, headers: optimized.headers });
  }

  return optimized;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const pathname = new URL(request.url).pathname;

    if (pathname === PROFILE_IMAGE_PATH) {
      return serveProfileImage(request, env);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
