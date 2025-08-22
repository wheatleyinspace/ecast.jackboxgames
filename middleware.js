// middleware.js
export async function middleware(req) {
  const url = req.nextUrl.clone();
  const ecastHost = "https://ecast.jackboxgames.com";

  // Прокси всех путей на ecast
  url.hostname = "ecast.jackboxgames.com";
  url.protocol = "https:";

  return fetch(url.toString(), {
    method: req.method,
    headers: req.headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? await req.arrayBuffer() : undefined,
  }).then(async (res) => {
    const headers = new Headers(res.headers);
    const body = await res.arrayBuffer();

    return new Response(body, {
      status: res.status,
      headers,
    });
  }).catch(err => new Response(err.toString(), { status: 500 }));
}

// Ловим все пути
export const config = {
  matcher: "/:path*",
};
