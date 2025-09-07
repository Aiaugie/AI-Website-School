export default async function (request, env) {
  try {
    const body = await request.json();
    const userMessage = body.message || "";

    // Build request payload for OpenRouter
    const payload = {
      model: "deepseek/deepseek-r1-0528:free",   // change to the model you want
      messages: [{ role: "user", content: userMessage }]
    };

    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const txt = await resp.text();
      return new Response(JSON.stringify({ error: txt }), { status: resp.status, headers: { "Content-Type": "application/json" }});
    }

    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ reply }), { headers: { "Content-Type": "application/json" }});
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" }});
  }
}