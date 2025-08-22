// api/proxy.js
const ecastDestination = "ecast.jackboxgames.com";

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `https://${req.headers.host}`);

    // Заголовки для fetch
    const headers = { ...req.headers };
    delete headers.host;
    delete headers.origin;

    const fetchUrl = `https://${ecastDestination}${url.pathname}`;

    const fetchOptions = {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body
    };

    const response = await fetch(fetchUrl, fetchOptions);

    // Копируем заголовки обратно
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const buffer = await response.arrayBuffer();
    res.status(response.status).send(Buffer.from(buffer));

  } catch (err) {
    res.status(500).send(err.toString());
  }
}
