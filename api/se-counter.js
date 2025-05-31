export default async function handler(req, res) {
  const { robert.furiel@saplinq.org, px85hb4szonygzf4lq3wdntijhh69ml8n2ju7g82} = process.env;
  if (!SMARTEMAIL_LOGIN || !SMARTEMAIL_TOKEN) {
    return res.status(500).send('Missing credentials');
  }

  const url =
    'https://app.smartemailing.cz/api/v3/contactlists/343/contacts/confirmed?limit=1';
  const auth = Buffer.from(
    `${SMARTEMAIL_LOGIN}:${SMARTEMAIL_TOKEN}`
  ).toString('base64');

  try {
    const r = await fetch(url, {
      headers: { Authorization: `Basic ${auth}`, Accept: 'application/json' },
    });
    if (!r.ok) throw new Error(`SmartEmailing HTTP ${r.status}`);
    const json = await r.json();
    const total = json?.meta?.total_count ?? json?.data?.total ?? 0;

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).send(String(total));
  } catch (e) {
    console.error(e);
    return res.status(500).send('error');
  }
}
