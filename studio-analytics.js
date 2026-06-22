(function () {
  const config = window.KestCoStudioAnalyticsConfig || {};
  const gameId = config.gameId || "studio";
  const supabaseUrl = String(config.supabaseUrl || "").replace(/\/$/, "");
  const supabaseAnonKey = config.supabaseAnonKey || "";
  const queueKey = `kestcoStudioEventQueue:${gameId}`;
  const sessionKey = `kestcoStudioSession:${gameId}`;

  function sessionId() {
    try {
      const stored = localStorage.getItem(sessionKey);
      if (stored) return stored;
      const next =
        crypto && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      localStorage.setItem(sessionKey, next);
      return next;
    } catch (_error) {
      return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
  }

  function cleanPayload(payload) {
    const source = payload && typeof payload === "object" ? payload : {};
    return Object.fromEntries(
      Object.entries(source)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => {
          if (typeof value === "string") return [key, value.slice(0, 160)];
          if (typeof value === "number" || typeof value === "boolean") return [key, value];
          return [key, JSON.stringify(value).slice(0, 240)];
        })
    );
  }

  function eventBody(eventName, payload) {
    return {
      game_id: gameId,
      event_name: eventName,
      session_id: sessionId(),
      source: window.location.host || "local-file",
      route: `${window.location.pathname}${window.location.search}`,
      referrer: document.referrer || "",
      payload: cleanPayload(payload)
    };
  }

  function readQueue() {
    try {
      return JSON.parse(localStorage.getItem(queueKey) || "[]");
    } catch (_error) {
      return [];
    }
  }

  function writeQueue(queue) {
    try {
      localStorage.setItem(queueKey, JSON.stringify(queue.slice(-40)));
    } catch (_error) {
      // Analytics should never block the games.
    }
  }

  async function send(body) {
    if (!supabaseUrl || !supabaseAnonKey) return false;

    const response = await fetch(`${supabaseUrl}/rest/v1/studio_game_events`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(body),
      keepalive: true
    });

    return response.ok;
  }

  async function flush() {
    const queue = readQueue();
    if (!queue.length) return;

    const remaining = [];
    for (const item of queue) {
      try {
        const ok = await send(item);
        if (!ok) remaining.push(item);
      } catch (_error) {
        remaining.push(item);
      }
    }
    writeQueue(remaining);
  }

  async function track(eventName, payload) {
    const body = eventBody(eventName, payload);
    try {
      const ok = await send(body);
      if (!ok) writeQueue([...readQueue(), body]);
    } catch (_error) {
      writeQueue([...readQueue(), body]);
    }
  }

  window.KestCoAnalytics = {
    track,
    flush,
    isConfigured: () => Boolean(supabaseUrl && supabaseAnonKey)
  };

  flush();
  track("page_view", { title: document.title });
})();
