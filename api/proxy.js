// api/proxy.js
const ecastDestination = "ecast.jackboxgames.com";
const ecastAws = "ecast-prod-28687133.us-east-1.elb.amazonaws.com";

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `https://${req.headers.host}`);

    const newHeaders = { ...req.headers };
    delete newHeaders.host;
    delete newHeaders.origin;

    let fetchUrl = '';
    const fetchOptions = {
      method: req.method,
      headers: newHeaders,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = req.body;
    }

    if (url.pathname.startsWith("/api")) {
      fetchUrl = `http://${ecastAws}${url.pathname}`;
      newHeaders.host = ecastDestination;
    } else {
      fetchUrl = `https://${ecastDestination}${url.pathname}`;
    }

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
