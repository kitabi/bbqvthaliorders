// File: /api/catering.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const URL = process.env.APPS_SCRIPT_WEBAPP_URL;
  if (!URL) {
    return res.status(500).json({ ok: false, error: 'Missing APPS_SCRIPT_WEBAPP_URL env var' });
  }

  try {
    // Ensure we have a raw JSON string to forward as text/plain
    let raw;
    if (typeof req.body === 'string') {
      raw = req.body;
    } else {
      raw = JSON.stringify(req.body || {});
    }

    const r = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' }, // avoids preflight on Apps Script
      body: raw
    });

    // Try to pass through JSON; if not JSON, fall back to ok flag
    let json;
    try {
      json = await r.json();
    } catch {
      json = { ok: r.ok };
    }

    return res.status(r.ok ? 200 : 500).json(json);
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
