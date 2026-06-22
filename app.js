const games = [
  {
    id: "word-architect",
    name: "Word Architect",
    logo: "assets/word-architect-logo.png",
    status: "Local editor ready",
    statusTone: "needs-url",
    summary:
      "A daily word-grouping game built around meaning, connection, insight, and Word Lens vocabulary.",
    dataSource: "Waiting for shared analytics",
    links: [
      { label: "Open Local Editor", url: "http://localhost:3001/editor", primary: true },
      { label: "Open Local Game", url: "http://localhost:3001/", primary: false },
      { label: "Live URL Needed", url: "", disabled: true }
    ],
    metrics: [
      { label: "Daily Plays", value: "--", note: "Connect play_started events." },
      { label: "Completion Rate", value: "--", note: "Track final dashboard reach." },
      { label: "Word Lens Clicks", value: "--", note: "See which words invite curiosity." },
      { label: "Hardest Group", value: "--", note: "Measure missed groups and reveals." }
    ],
    readiness: [
      { label: "Editor route mapped", detail: "/editor is ready for local review.", ready: true },
      { label: "Week inventory active", detail: "Daily puzzle library is in the game project.", ready: true },
      { label: "Analytics events", detail: "Needs Supabase event capture.", ready: false },
      { label: "Public link confirmed", detail: "Add the production URL once final.", ready: false }
    ],
    workflow: [
      "Review the daily puzzle in the editor.",
      "Check Word Lens candidates and definitions.",
      "Playtest, publish, then watch dashboard completion."
    ]
  },
  {
    id: "top-tier",
    name: "Top Tier",
    logo: "assets/top-tier-logo.png",
    status: "Live editor ready",
    statusTone: "ready",
    summary:
      "A 12-question, four-tier puzzle climb with timed answers, practice continuation, and editor-ready weekly games.",
    dataSource: "Waiting for shared analytics",
    links: [
      { label: "Open Editor", url: "https://top-tier-game.vercel.app/?editor=1", primary: true },
      { label: "Open Live Game", url: "https://top-tier-game.vercel.app/", primary: false },
      { label: "Open Local Game", url: "file:///C:/Users/erino/top-tier-game/index.html", primary: false }
    ],
    metrics: [
      { label: "Daily Plays", value: "--", note: "Connect starts by day and week." },
      { label: "Tier Reached", value: "--", note: "Measure where players fall." },
      { label: "Avg. Time Left", value: "--", note: "Find too-easy or too-hard questions." },
      { label: "Miss Hotspot", value: "--", note: "Question-level difficulty map." }
    ],
    readiness: [
      { label: "Live game link works", detail: "Production game is mapped.", ready: true },
      { label: "Editor route mapped", detail: "?editor=1 opens the backstage editor.", ready: true },
      { label: "Readiness checklist", detail: "Editor includes final game checks.", ready: true },
      { label: "Analytics events", detail: "Needs Supabase event capture.", ready: false }
    ],
    workflow: [
      "Choose week and day in the editor.",
      "Use the final readiness board before publishing.",
      "Track tier reach and question misses after launch."
    ]
  },
  {
    id: "your-story",
    name: "Your Story",
    logo: "assets/your-story-logo.png",
    status: "Live writer ready",
    statusTone: "ready",
    summary:
      "An ad-lib story experience where player words become a cinematic world, with a writer portal and AI poster bridge.",
    dataSource: "Waiting for shared analytics",
    links: [
      { label: "Open Writer Portal", url: "https://your-story-zeta.vercel.app/?writer=1", primary: true },
      { label: "Open Live Game", url: "https://your-story-zeta.vercel.app/", primary: false },
      { label: "Open Local Game", url: "http://localhost:3003/", primary: false }
    ],
    metrics: [
      { label: "Stories Started", value: "--", note: "Connect first word entry." },
      { label: "Worlds Built", value: "--", note: "Track Build My World completions." },
      { label: "Spark Ideas", value: "--", note: "See when players need help." },
      { label: "Poster Success", value: "--", note: "Track AI endpoint results." }
    ],
    readiness: [
      { label: "Writer portal mapped", detail: "?writer=1 opens the story writer.", ready: true },
      { label: "AI bridge deployed", detail: "/api/create-world is live.", ready: true },
      { label: "OpenAI key", detail: "Add OPENAI_API_KEY in Vercel for real posters.", ready: false },
      { label: "Analytics events", detail: "Needs Supabase event capture.", ready: false }
    ],
    workflow: [
      "Draft the story frame in the writer portal.",
      "Playtest the blanks and generated movie prompt.",
      "Add the OpenAI key, then watch poster generation health."
    ]
  }
];

const gameList = document.querySelector("#gameList");
const gameLogo = document.querySelector("#gameLogo");
const gameName = document.querySelector("#gameName");
const gameStatus = document.querySelector("#gameStatus");
const gameSummary = document.querySelector("#gameSummary");
const actionBar = document.querySelector("#actionBar");
const metricsGrid = document.querySelector("#metricsGrid");
const dataSource = document.querySelector("#dataSource");
const readyList = document.querySelector("#readyList");
const readyCount = document.querySelector("#readyCount");
const workflowList = document.querySelector("#workflowList");

let activeGameId = localStorage.getItem("studioActiveGame") || games[0].id;
let analyticsRows = [];
let analyticsConfigured = false;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function activeGame() {
  return games.find((game) => game.id === activeGameId) || games[0];
}

function analyticsConfig() {
  return window.KestCoStudioAnalyticsConfig || {};
}

function rowsFor(gameId, eventName) {
  return analyticsRows.filter(
    (row) => row.game_id === gameId && (!eventName || row.event_name === eventName)
  );
}

function eventTotal(gameId, eventName) {
  return rowsFor(gameId, eventName).reduce((total, row) => total + Number(row.total_count || 0), 0);
}

function correctTotal(gameId, eventName) {
  return rowsFor(gameId, eventName).reduce((total, row) => total + Number(row.correct_count || 0), 0);
}

function averageSeconds(gameId, eventName) {
  const rows = rowsFor(gameId, eventName).filter((row) => row.avg_seconds !== null);
  const attempts = rows.reduce((total, row) => total + Number(row.total_count || 0), 0);
  if (!attempts) return 0;

  const weighted = rows.reduce(
    (total, row) => total + Number(row.avg_seconds || 0) * Number(row.total_count || 0),
    0
  );

  return Math.round(weighted / attempts);
}

function percent(part, total) {
  if (!total) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

function liveMetric(game, metric) {
  if (!analyticsConfigured) return metric;

  if (game.id === "word-architect") {
    if (metric.label === "Daily Plays") {
      return { ...metric, value: String(eventTotal(game.id, "game_started")), note: "Game starts in the last 7 days." };
    }
    if (metric.label === "Completion Rate") {
      const starts = eventTotal(game.id, "game_started");
      return { ...metric, value: percent(eventTotal(game.id, "puzzle_completed"), starts), note: "Completed puzzles divided by starts." };
    }
    if (metric.label === "Word Lens Clicks") {
      return { ...metric, value: String(eventTotal(game.id, "word_lens_opened")), note: "Curiosity clicks in the last 7 days." };
    }
    if (metric.label === "Hardest Group") {
      return { ...metric, value: String(eventTotal(game.id, "answer_wrong")), note: "Wrong insight answers in the last 7 days." };
    }
  }

  if (game.id === "top-tier") {
    if (metric.label === "Daily Plays") {
      return { ...metric, value: String(eventTotal(game.id, "game_started")), note: "Game starts in the last 7 days." };
    }
    if (metric.label === "Tier Reached") {
      return { ...metric, value: String(eventTotal(game.id, "game_completed")), note: "Completed result screens in the last 7 days." };
    }
    if (metric.label === "Avg. Time Left") {
      const average = averageSeconds(game.id, "question_answered");
      return { ...metric, value: average ? `${Math.max(0, 30 - average)}s` : "0s", note: "Average clock time left on answered questions." };
    }
    if (metric.label === "Miss Hotspot") {
      const answers = eventTotal(game.id, "question_answered");
      const correct = correctTotal(game.id, "question_answered");
      return { ...metric, value: String(Math.max(0, answers - correct)), note: "Misses and timeouts in the last 7 days." };
    }
  }

  if (game.id === "your-story") {
    if (metric.label === "Stories Started") {
      return { ...metric, value: String(eventTotal(game.id, "story_started")), note: "Players who entered the writing screen." };
    }
    if (metric.label === "Worlds Built") {
      return { ...metric, value: String(eventTotal(game.id, "world_built")), note: "Completed stories sent to the reel." };
    }
    if (metric.label === "Spark Ideas") {
      return { ...metric, value: String(eventTotal(game.id, "spark_ideas")), note: "Idea helper uses in the last 7 days." };
    }
    if (metric.label === "Poster Success") {
      const attempts = eventTotal(game.id, "poster_requested");
      return { ...metric, value: percent(eventTotal(game.id, "poster_generated"), attempts), note: "Generated posters divided by poster requests." };
    }
  }

  return metric;
}

function renderGameList() {
  gameList.innerHTML = games
    .map((game) => {
      const active = game.id === activeGameId ? " active" : "";
      return `
        <button class="game-button${active}" type="button" data-game-id="${escapeHtml(game.id)}">
          <img src="${escapeHtml(game.logo)}" alt="" />
          <span>
            <strong>${escapeHtml(game.name)}</strong>
            <span>${escapeHtml(game.status)}</span>
          </span>
        </button>
      `;
    })
    .join("");

  gameList.querySelectorAll(".game-button").forEach((button) => {
    button.addEventListener("click", () => {
      activeGameId = button.dataset.gameId;
      localStorage.setItem("studioActiveGame", activeGameId);
      window.KestCoAnalytics?.track("studio_game_selected", { selected_game: activeGameId });
      renderPortal();
    });
  });
}

function renderActions(game) {
  actionBar.innerHTML = game.links
    .map((link) => {
      const classes = ["studio-action"];
      if (!link.primary) classes.push("secondary");
      if (link.disabled) classes.push("disabled");
      const href = link.disabled ? "#" : link.url;
      const target = link.disabled ? "" : ' target="_blank" rel="noreferrer"';
      return `<a class="${classes.join(" ")}" href="${escapeHtml(href)}"${target}>${escapeHtml(link.label)}</a>`;
    })
    .join("");
}

function renderMetrics(game) {
  metricsGrid.innerHTML = game.metrics
    .map((metric) => {
      const displayMetric = liveMetric(game, metric);
      return `
        <article class="metric-card">
          <span>${escapeHtml(displayMetric.label)}</span>
          <strong>${escapeHtml(displayMetric.value)}</strong>
          <p>${escapeHtml(displayMetric.note)}</p>
        </article>
      `;
    })
    .join("");
}

function renderReadyBoard(game) {
  const ready = game.readiness.filter((item) => item.ready).length;
  readyCount.textContent = `${ready} of ${game.readiness.length} ready`;
  readyList.innerHTML = game.readiness
    .map((item) => {
      return `
        <article class="ready-item${item.ready ? "" : " pending"}">
          <span class="ready-dot">${item.ready ? "OK" : "!"}</span>
          <div>
            <strong>${escapeHtml(item.label)}</strong>
            <p>${escapeHtml(item.detail)}</p>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderWorkflow(game) {
  workflowList.innerHTML = game.workflow
    .map((item, index) => {
      return `
        <article class="workflow-item">
          <span class="workflow-step">${index + 1}</span>
          <div>
            <strong>Step ${index + 1}</strong>
            <p>${escapeHtml(item)}</p>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderDetail() {
  const game = activeGame();
  gameLogo.src = game.logo;
  gameLogo.alt = `${game.name} logo`;
  gameName.textContent = game.name;
  gameStatus.textContent = game.status;
  gameStatus.className = `status-pill${game.statusTone === "needs-url" ? " needs-url" : ""}`;
  gameSummary.textContent = game.summary;
  dataSource.textContent = analyticsConfigured ? "Live analytics connected" : game.dataSource;
  renderActions(game);
  renderMetrics(game);
  renderReadyBoard(game);
  renderWorkflow(game);
}

function renderPortal() {
  renderGameList();
  renderDetail();
}

renderPortal();

async function loadAnalyticsRows() {
  const config = analyticsConfig();
  const supabaseUrl = String(config.supabaseUrl || "").replace(/\/$/, "");
  const supabaseAnonKey = config.supabaseAnonKey || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return;
  }

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const query = [
    "select=event_date,game_id,event_name,total_count,correct_count,avg_seconds,latest_at",
    `event_date=gte.${since}`
  ].join("&");

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/studio_game_daily_stats?${query}`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`
      }
    });

    if (!response.ok) return;

    const rows = await response.json();
    analyticsRows = Array.isArray(rows) ? rows : [];
    analyticsConfigured = true;
    renderDetail();
  } catch (_error) {
    analyticsConfigured = false;
  }
}

loadAnalyticsRows();
