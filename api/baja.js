// Función serverless (Vercel): recibe el correo desde baja.html y llama al
// webhook del trigger "darse_de_baja" de Relevance DESDE EL SERVIDOR.
// Así se evita el bloqueo de CORS del navegador.

const WEBHOOK = 'https://api-bcbe5a.stack.tryrelevance.com/latest/agents/hooks/custom-trigger/86743503-8dd4-4f3e-90de-b4a9677a89e0/618d42a0-00f3-4a19-a04c-b0a82d003f6c';

module.exports = async (req, res) => {
  const q = req.query || {};
  const b = req.body || {};
  const email = ((q.email || b.email || '') + '').trim();

  if (!email) {
    res.status(400).json({ ok: false, error: 'missing_email' });
    return;
  }

  try {
    const r = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    });
    res.status(r.ok ? 200 : 502).json({ ok: r.ok, status: r.status });
  } catch (e) {
    res.status(502).json({ ok: false, error: 'upstream_error' });
  }
};
