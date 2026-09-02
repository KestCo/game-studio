const games = [
  {
    id: "word-architect",
    name: "Word Architect",
    logo: "assets/word-architect-logo.png",
    status: "Live editor ready",
    statusTone: "ready",
    summary:
      "A daily word-grouping game built around meaning, connection, insight, and Word Lens vocabulary.",
    dataSource: "Live analytics connected",
    links: [
      { label: "Open Editor", url: "https://word-architect.vercel.app/editor", primary: true },
      { label: "Open Live Game", url: "https://word-architect.vercel.app/", primary: false },
      { label: "Open Local Editor", url: "http://localhost:3001/editor", primary: false }
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
      { label: "Analytics events", detail: "Supabase event capture is live.", ready: true },
      { label: "Shared draft saving", detail: "Editor branches save to Supabase.", ready: true },
      { label: "Public link confirmed", detail: "Production URL is mapped.", ready: true }
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
      { label: "Analytics events", detail: "Supabase event capture is live.", ready: true },
      { label: "Shared draft saving", detail: "Editor branches save to Supabase.", ready: true }
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
    status: "Publishing workflow ready",
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
      { label: "Shared draft saving", detail: "Protected story drafts sync through Supabase.", ready: true },
      { label: "Review and approval", detail: "Command Center can approve or return submitted stories.", ready: true },
      { label: "Versioned publishing", detail: "Approved stories publish with revision history and rollback.", ready: true },
      { label: "AI bridge deployed", detail: "/api/create-world is live.", ready: true },
      { label: "OpenAI key", detail: "Add OPENAI_API_KEY in Vercel for real posters.", ready: false },
      { label: "Analytics events", detail: "Needs Supabase event capture.", ready: false }
    ],
    workflow: [
      "Draft the story frame in the writer portal.",
      "Playtest, save, and submit the shared draft for review.",
      "Approve it here, then publish or roll back from the writer portal."
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
const draftSource = document.querySelector("#draftSource");
const draftSummary = document.querySelector("#draftSummary");
const draftList = document.querySelector("#draftList");
const readyList = document.querySelector("#readyList");
const readyCount = document.querySelector("#readyCount");
const workflowList = document.querySelector("#workflowList");
const attentionLead = document.querySelector("#attentionLead");
const attentionList = document.querySelector("#attentionList");
const suiteAnalyticsSource = document.querySelector("#suiteAnalyticsSource");
const suiteMetrics = document.querySelector("#suiteMetrics");
const openViewButtons = document.querySelectorAll("[data-open-view]");
const closeViewButtons = document.querySelectorAll("[data-close-view]");
const studioViews = document.querySelectorAll(".studio-view");
const clearUnchangedBranchesButton = document.querySelector("#clearUnchangedBranches");
const branchCleanupStatus = document.querySelector("#branchCleanupStatus");
const yourStoryKeyDialog = document.querySelector("#yourStoryKeyDialog");
const yourStoryKeyForm = document.querySelector("#yourStoryKeyForm");
const yourStoryKeyInput = document.querySelector("#yourStoryKeyInput");
const yourStoryKeyCancel = document.querySelector("#yourStoryKeyCancel");
const yourStoryKeyMessage = document.querySelector("#yourStoryKeyMessage");

let activeGameId = localStorage.getItem("studioActiveGame") || games[0].id;
let analyticsRows = [];
let analyticsConfigured = false;
let draftRowsByGame = {
  "word-architect": [],
  "top-tier": [],
  "your-story": []
};
let draftsConfigured = false;
let draftStatusUpdatingKey = "";
let hiddenDraftBranchKeys = new Set();
let branchCleanupMessage = "";

try {
  hiddenDraftBranchKeys = new Set(
    JSON.parse(localStorage.getItem("studioHiddenDraftBranches") || "[]")
  );
} catch (_error) {
  hiddenDraftBranchKeys = new Set();
}

const draftSources = {
  "word-architect": {
    table: "word_architect_drafts",
    select: "draft_id,source_game_id,week,day,title,status,editor_name,publication,updated_at,submitted_at",
    editorUrl: "https://word-architect.vercel.app/editor"
  },
  "top-tier": {
    table: "top_tier_drafts",
    select: "draft_id,source_game_id,week,day,label,status,editor_name,news_organization,updated_at,submitted_at",
    editorUrl: "https://top-tier-game.vercel.app/?editor=1"
  },
  "your-story": {
    table: "your_story_drafts",
    select: "draft_id,source_template_id,source_game_id,story_number,week,day,title,status,editor_name,revision,updated_at,submitted_at,published_at",
    editorUrl: "https://your-story-zeta.vercel.app/?writer=1"
  }
};

const draftWorkflowStates = {
  draft: {
    label: "Edited Version",
    detail: "The editor is still shaping this draft."
  },
  needs_revision: {
    label: "Corrections Needed",
    detail: "This draft was sent back for another edit."
  },
  submitted: {
    label: "Final Review",
    detail: "This draft is ready for Brad's review."
  },
  publication_ready: {
    label: "Publication Ready",
    detail: "This draft is approved and waiting to be published."
  },
  published: {
    label: "Published",
    detail: "This draft has been marked as published."
  },
  approved: {
    label: "Approved",
    detail: "This draft has been approved."
  }
};

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

function draftConfig() {
  const config = analyticsConfig();
  const supabaseUrl = String(config.supabaseUrl || "").replace(/\/$/, "");
  const supabaseAnonKey = config.supabaseAnonKey || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return {
    supabaseUrl,
    supabaseAnonKey
  };
}

function formatDateTime(value) {
  if (!value) return "No timestamp";

  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function draftStatusLabel(status) {
  return draftWorkflowStates[normalizeDraftStatus(status)].label;
}

function draftStatusDetail(status) {
  return draftWorkflowStates[normalizeDraftStatus(status)].detail;
}

function normalizeDraftStatus(status) {
  if (
    status === "submitted" ||
    status === "publication_ready" ||
    status === "published" ||
    status === "approved" ||
    status === "needs_revision"
  ) {
    return status;
  }

  return "draft";
}

function draftStatusClass(status) {
  return normalizeDraftStatus(status).replace("_", "-");
}

function draftEditorLine(row) {
  const editor = row.editor_name || "No editor name";
  const organization = row.news_organization || row.publication || "";
  return organization ? `${editor}, ${organization}` : editor;
}

function draftTitle(row) {
  if (row.title) return row.title;
  if (row.week && row.day) return `Week ${row.week}, Day ${row.day}`;
  if (row.label) return `${row.label} - Day ${row.day || "?"}`;
  return row.source_game_id || "Untitled draft";
}

function draftEditorUrl(game, row) {
  const source = draftSources[game.id];
  if (!source) return "";

  if ((game.id === "top-tier" || game.id === "word-architect" || game.id === "your-story") && row.week && row.day) {
    const separator = source.editorUrl.includes("?") ? "&" : "?";
    return `${source.editorUrl}${separator}week=${encodeURIComponent(row.week)}&day=${encodeURIComponent(row.day)}`;
  }

  return source.editorUrl;
}

function draftRowKey(gameId, draftId) {
  return `${gameId}:${draftId}`;
}

function textValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function hasEditorSignal(row = {}) {
  return Boolean(
    textValue(row.editor_name) ||
      textValue(row.news_organization) ||
      textValue(row.publication) ||
      textValue(row.submitted_at)
  );
}

function isHiddenDraftBranch(gameId, row = {}) {
  return (
    hiddenDraftBranchKeys.has(draftRowKey(gameId, row.draft_id)) &&
    normalizeDraftStatus(row.status) === "draft" &&
    !hasEditorSignal(row)
  );
}

function activeDraftRows(gameId, rows = []) {
  return (rows || []).filter((row) => row && !isHiddenDraftBranch(gameId, row));
}

function clearableDraftBranches() {
  return Object.entries(draftRowsByGame).flatMap(([gameId, rows]) =>
    activeDraftRows(gameId, rows)
      .filter(
        (row) =>
          normalizeDraftStatus(row.status) === "draft" &&
          row.draft_id &&
          !hasEditorSignal(row)
      )
      .map((row) => ({ gameId, row }))
  );
}

function saveHiddenDraftBranches() {
  try {
    localStorage.setItem("studioHiddenDraftBranches", JSON.stringify([...hiddenDraftBranchKeys]));
  } catch (_error) {
    // This cleanup is only a local view preference.
  }
}

function nextDraftAction(status, gameId) {
  if (status === "draft" || status === "needs_revision") {
    return {
      label: "Move to Final Review",
      nextStatus: "submitted"
    };
  }

  if (status === "submitted") {
    return {
      label: "Approve for Publication",
      nextStatus: "publication_ready"
    };
  }

  if (status === "publication_ready" && gameId !== "your-story") {
    return {
      label: "Mark Published",
      nextStatus: "published"
    };
  }

  return null;
}

function gameForDraft(gameId) {
  return games.find((game) => game.id === gameId);
}

function attentionPriority(status) {
  const priorities = {
    needs_revision: 1,
    submitted: 2,
    publication_ready: 3,
    draft: 4
  };

  return priorities[status] || 9;
}

function attentionDetail(status) {
  if (status === "needs_revision") {
    return "Needs another editing pass before it comes back to review.";
  }

  if (status === "submitted") {
    return "Ready for Brad's review.";
  }

  if (status === "publication_ready") {
    return "Approved and waiting to be marked as live inventory.";
  }

  return "Saved branch is still being shaped.";
}

function attentionItems() {
  return Object.entries(draftRowsByGame)
    .flatMap(([gameId, rows]) => {
      const game = gameForDraft(gameId);
      if (!game) return [];

      return activeDraftRows(gameId, rows).map((row) => ({
        game,
        row,
        status: normalizeDraftStatus(row.status)
      }));
    })
    .filter((item) => item.status !== "published" && item.status !== "approved")
    .sort((a, b) => {
      const priorityDelta = attentionPriority(a.status) - attentionPriority(b.status);
      if (priorityDelta) return priorityDelta;

      return new Date(b.row.updated_at || 0) - new Date(a.row.updated_at || 0);
    })
    .slice(0, 6);
}

function renderAttention() {
  if (!attentionList || !attentionLead) return;

  const config = draftConfig();
  if (!config) {
    attentionLead.textContent = "Connect Supabase drafts to turn this into a live daily checklist.";
    attentionList.innerHTML = `
      <article class="attention-empty">
        Add the studio Supabase URL and anon key, then this board will show draft review, correction, and publication work.
      </article>
    `;
    return;
  }

  if (!draftsConfigured) {
    attentionLead.textContent = "Checking the live draft workflow.";
    attentionList.innerHTML = `
      <article class="attention-empty">
        Loading the latest draft branches from the editor portals.
      </article>
    `;
    return;
  }

  const items = attentionItems();

  if (!items.length) {
    attentionLead.textContent = "All clear. Nothing is waiting for review, correction, or publication.";
    attentionList.innerHTML = `
      <article class="attention-empty attention-empty-clear">
        The suite has no draft branches needing action right now.
      </article>
    `;
    return;
  }

  attentionLead.textContent = `${items.length} item${items.length === 1 ? "" : "s"} waiting across the suite.`;
  attentionList.innerHTML = items
    .map(({ game, row, status }) => {
      const action = nextDraftAction(status);
      const editorUrl = draftEditorUrl(game, row);
      const rowKey = draftRowKey(game.id, row.draft_id);
      const isUpdating = draftStatusUpdatingKey === rowKey;
      const updatedAt = row.updated_at ? `Updated ${formatDateTime(row.updated_at)}` : "No save time yet";
      const editorLine = draftEditorLine(row);

      return `
        <article class="attention-card ${draftStatusClass(status)}">
          <div class="attention-card-top">
            <span class="attention-game">${escapeHtml(game.name)}</span>
            <span class="draft-state-pill ${draftStatusClass(status)}">${escapeHtml(draftStatusLabel(status))}</span>
          </div>
          <strong>${escapeHtml(draftTitle(row))}</strong>
          <p>${escapeHtml(attentionDetail(status))}</p>
          <span class="attention-meta">${escapeHtml(updatedAt)} | ${escapeHtml(editorLine)}</span>
          <div class="attention-actions">
            ${editorUrl ? `<a class="attention-link" href="${escapeHtml(editorUrl)}">Open Editor</a>` : ""}
            ${
              action
                ? `
                  <button
                    class="attention-state-button"
                    type="button"
                    data-game-id="${escapeHtml(game.id)}"
                    data-draft-id="${escapeHtml(row.draft_id)}"
                    data-next-status="${escapeHtml(action.nextStatus)}"
                    ${isUpdating ? "disabled" : ""}
                  >
                    ${isUpdating ? "Saving..." : escapeHtml(action.label)}
                  </button>
                `
                : ""
            }
            ${
              status === "submitted"
                ? `
                  <button
                    class="attention-state-button secondary"
                    type="button"
                    data-game-id="${escapeHtml(game.id)}"
                    data-draft-id="${escapeHtml(row.draft_id)}"
                    data-next-status="needs_revision"
                    ${isUpdating ? "disabled" : ""}
                  >
                    Send Back
                  </button>
                `
                : ""
            }
          </div>
        </article>
      `;
    })
    .join("");

  attentionList.querySelectorAll(".attention-state-button").forEach((button) => {
    button.addEventListener("click", () => {
      updateDraftStatus(
        button.dataset.gameId,
        button.dataset.draftId,
        button.dataset.nextStatus
      );
    });
  });
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

function allDraftRows() {
  return Object.entries(draftRowsByGame).flatMap(([gameId, rows]) =>
    activeDraftRows(gameId, rows).map((row) => ({ ...row, game_id: gameId }))
  );
}

function draftCountForStatuses(statuses) {
  const normalizedStatuses = new Set(statuses.map(normalizeDraftStatus));
  return allDraftRows().filter((row) => normalizedStatuses.has(normalizeDraftStatus(row.status))).length;
}

function suiteTotalEvents() {
  return analyticsRows.reduce((total, row) => total + Number(row.total_count || 0), 0);
}

function suiteEventTotal(needles) {
  return analyticsRows
    .filter((row) => {
      const eventName = String(row.event_name || "").toLowerCase();
      return needles.some((needle) => eventName.includes(needle));
    })
    .reduce((total, row) => total + Number(row.total_count || 0), 0);
}

function suiteMetricData() {
  const portalCount = games.reduce(
    (total, game) => total + game.links.filter((link) => /editor|writer|portal/i.test(link.label)).length,
    0
  );
  const attentionCount = draftsConfigured ? attentionItems().length : null;
  const reviewCount = draftsConfigured ? draftCountForStatuses(["submitted", "publication_ready"]) : null;
  const eventCount = analyticsConfigured ? suiteTotalEvents() : null;
  const storyMagicCount = analyticsConfigured ? suiteEventTotal(["world", "reel", "video", "poster"]) : null;

  return [
    {
      label: "Games live",
      value: games.length,
      note: "Public front door points players to the active game experiences."
    },
    {
      label: "Studio portals",
      value: portalCount,
      note: "Backstage links open the editors, writer portal, and command workflows."
    },
    {
      label: "Events tracked",
      value: eventCount ?? "--",
      note: analyticsConfigured
        ? "Recent Supabase events are flowing into the Command Center."
        : "Connect analytics to light this up with live player activity."
    },
    {
      label: "Needs attention",
      value: attentionCount ?? "--",
      note: draftsConfigured
        ? "Drafts waiting for review, corrections, or publishing."
        : "Connect draft data to show today's editorial queue."
    },
    {
      label: "Review queue",
      value: reviewCount ?? "--",
      note: draftsConfigured
        ? "Final review and publication-ready drafts waiting on a decision."
        : "Draft workflow data has not been loaded yet."
    },
    {
      label: "Story magic",
      value: storyMagicCount ?? "--",
      note: analyticsConfigured
        ? "Your Story reel, poster, world, and video events in the current window."
        : "Your Story magic events will show here once analytics are connected."
    }
  ];
}

function renderSuiteAnalytics() {
  if (!suiteMetrics || !suiteAnalyticsSource) return;

  if (analyticsConfigured && draftsConfigured) {
    suiteAnalyticsSource.textContent = "Live events and drafts connected";
  } else if (analyticsConfigured) {
    suiteAnalyticsSource.textContent = "Live analytics connected";
  } else if (draftsConfigured) {
    suiteAnalyticsSource.textContent = "Live drafts connected";
  } else {
    suiteAnalyticsSource.textContent = "Waiting for live data";
  }

  suiteMetrics.innerHTML = suiteMetricData()
    .map(
      (metric) => `
        <article class="suite-metric">
          <span>${escapeHtml(metric.label)}</span>
          <strong>${escapeHtml(metric.value)}</strong>
          <p>${escapeHtml(metric.note)}</p>
        </article>
      `
    )
    .join("");
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

function renderDrafts(game) {
  const source = draftSources[game.id];
  const rows = [...activeDraftRows(game.id, draftRowsByGame[game.id] || [])].sort(
    (a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0)
  );
  const edited = rows.filter((row) => normalizeDraftStatus(row.status) === "draft").length;
  const needsRevision = rows.filter(
    (row) => normalizeDraftStatus(row.status) === "needs_revision"
  ).length;
  const submitted = rows.filter(
    (row) => normalizeDraftStatus(row.status) === "submitted"
  ).length;
  const publicationReady = rows.filter(
    (row) => normalizeDraftStatus(row.status) === "publication_ready"
  ).length;
  const published = rows.filter(
    (row) => normalizeDraftStatus(row.status) === "published"
  ).length;
  const latest = rows[0];

  if (!source) {
    draftSource.textContent = "No draft table yet";
    draftSummary.innerHTML = `
      <article class="draft-stat">
        <span>Draft Workflow</span>
        <strong>Not connected</strong>
        <p>Your Story uses the writer portal for now.</p>
      </article>
    `;
    draftList.innerHTML = `
      <p class="draft-empty">Writer draft saving can come after the story template workflow settles.</p>
    `;
    return;
  }

  draftSource.textContent = draftsConfigured ? "Live drafts connected" : "Loading drafts";
  draftSummary.innerHTML = `
    <article class="draft-stat">
      <span>Edited Version</span>
      <strong>${edited}</strong>
      <p>Saved branches still being shaped.</p>
    </article>
    <article class="draft-stat">
      <span>Corrections Needed</span>
      <strong>${needsRevision}</strong>
      <p>Drafts sent back for another pass.</p>
    </article>
    <article class="draft-stat">
      <span>Final Review</span>
      <strong>${submitted}</strong>
      <p>Drafts ready for Brad's review.</p>
    </article>
    <article class="draft-stat">
      <span>Publication Ready</span>
      <strong>${publicationReady}</strong>
      <p>Approved drafts waiting to publish.</p>
    </article>
    <article class="draft-stat">
      <span>Published</span>
      <strong>${published}</strong>
      <p>Drafts marked as live inventory.</p>
    </article>
    <article class="draft-stat wide">
      <span>Latest Activity</span>
      <strong>${latest ? escapeHtml(formatDateTime(latest.updated_at)) : "None yet"}</strong>
      <p>${latest ? escapeHtml(draftTitle(latest)) : "No shared drafts have been saved."}</p>
    </article>
  `;

  if (!rows.length) {
    draftList.innerHTML = `
      <p class="draft-empty">No saved draft branches yet. Once an editor saves, the branch will appear here.</p>
    `;
    return;
  }

  draftList.innerHTML = rows
    .slice(0, 5)
    .map((row) => {
      const editorUrl = draftEditorUrl(game, row);
      const status = normalizeDraftStatus(row.status);
      const rowKey = draftRowKey(game.id, row.draft_id);
      const updating = draftStatusUpdatingKey === rowKey;
      const primaryAction = nextDraftAction(status, game.id);
      return `
        <article class="draft-row ${escapeHtml(draftStatusClass(status))}">
          <div>
            <strong>${escapeHtml(draftTitle(row))}</strong>
            <p>
              <span class="draft-state-pill">${escapeHtml(draftStatusLabel(status))}</span>
              ${escapeHtml(draftEditorLine(row))}
            </p>
            <span>Last saved ${escapeHtml(formatDateTime(row.updated_at))}</span>
            <span>${escapeHtml(draftStatusDetail(status))}</span>
          </div>
          <div class="draft-row-actions">
            <a class="draft-link" href="${escapeHtml(editorUrl)}" target="_blank" rel="noreferrer">Open Editor</a>
            ${
              primaryAction
                ? `<button
                    class="draft-state-button"
                    type="button"
                    data-game-id="${escapeHtml(game.id)}"
                    data-draft-id="${escapeHtml(row.draft_id)}"
                    data-next-status="${escapeHtml(primaryAction.nextStatus)}"
                    ${updating ? "disabled" : ""}
                  >
                    ${updating ? "Updating..." : escapeHtml(primaryAction.label)}
                  </button>`
                : ""
            }
            ${
              status === "submitted"
                ? `<button
                    class="draft-state-button secondary"
                    type="button"
                    data-game-id="${escapeHtml(game.id)}"
                    data-draft-id="${escapeHtml(row.draft_id)}"
                    data-next-status="needs_revision"
                    ${updating ? "disabled" : ""}
                  >
                    Send Back
                  </button>`
                : ""
            }
          </div>
        </article>
      `;
    })
    .join("");

  draftList.querySelectorAll(".draft-state-button").forEach((button) => {
    button.addEventListener("click", () => {
      updateDraftStatus(
        button.dataset.gameId,
        button.dataset.draftId,
        button.dataset.nextStatus
      );
    });
  });
}

let resolveYourStoryEditorKey = null;

function finishYourStoryKeyRequest(key = "") {
  if (!resolveYourStoryEditorKey) return;
  const resolve = resolveYourStoryEditorKey;
  resolveYourStoryEditorKey = null;
  if (yourStoryKeyDialog?.open) yourStoryKeyDialog.close();
  resolve(key);
}

function yourStoryEditorKey() {
  const stored = sessionStorage.getItem("yourStoryCommandCenterEditorKey") || "";
  if (stored) return Promise.resolve(stored);
  if (!yourStoryKeyDialog || !yourStoryKeyInput) return Promise.resolve("");

  return new Promise((resolve) => {
    resolveYourStoryEditorKey = resolve;
    yourStoryKeyInput.value = "";
    yourStoryKeyMessage.textContent = "";
    yourStoryKeyDialog.showModal();
    requestAnimationFrame(() => yourStoryKeyInput.focus());
  });
}

async function updateYourStoryDraftStatus(draftId, nextStatus) {
  const key = await yourStoryEditorKey();
  if (!key) throw new Error("The Your Story editor key is required.");
  const response = await fetch("https://your-story-zeta.vercel.app/api/story-status", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Editor-Key": key
    },
    body: JSON.stringify({ draftId, status: nextStatus })
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.ok === false) {
    if (response.status === 401) sessionStorage.removeItem("yourStoryCommandCenterEditorKey");
    throw new Error(body.message || `Draft status update failed with ${response.status}`);
  }
  return body.draft;
}

yourStoryKeyForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const key = yourStoryKeyInput.value.trim();
  if (!key) {
    yourStoryKeyMessage.textContent = "Enter the editor key to continue.";
    yourStoryKeyInput.focus();
    return;
  }
  sessionStorage.setItem("yourStoryCommandCenterEditorKey", key);
  finishYourStoryKeyRequest(key);
});

yourStoryKeyCancel?.addEventListener("click", () => finishYourStoryKeyRequest());
yourStoryKeyDialog?.addEventListener("cancel", (event) => {
  event.preventDefault();
  finishYourStoryKeyRequest();
});

async function updateDraftStatus(gameId, draftId, nextStatus) {
  const config = draftConfig();
  const source = draftSources[gameId];
  if (!config || !source || !draftId || !nextStatus) return;

  const rowKey = draftRowKey(gameId, draftId);
  draftStatusUpdatingKey = rowKey;
  renderDetail();

  const now = new Date().toISOString();
  const payload = {
    status: nextStatus,
    updated_at: now
  };

  if (nextStatus === "submitted") {
    payload.submitted_at = now;
  }

  try {
    if (gameId === "your-story") {
      const updatedRow = await updateYourStoryDraftStatus(draftId, nextStatus);
      draftRowsByGame[gameId] = (draftRowsByGame[gameId] || []).map((row) =>
        row.draft_id === draftId ? { ...row, ...updatedRow } : row
      );
      return;
    }

    const response = await fetch(
      `${config.supabaseUrl}/rest/v1/${source.table}?draft_id=eq.${encodeURIComponent(draftId)}`,
      {
        method: "PATCH",
        headers: {
          apikey: config.supabaseAnonKey,
          Authorization: `Bearer ${config.supabaseAnonKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation"
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      throw new Error(`Draft status update failed with ${response.status}`);
    }

    const updatedRows = await response.json();
    const updatedRow = Array.isArray(updatedRows) ? updatedRows[0] : null;

    if (updatedRow) {
      draftRowsByGame[gameId] = (draftRowsByGame[gameId] || []).map((row) =>
        row.draft_id === draftId ? { ...row, ...updatedRow } : row
      );
    }
  } catch (error) {
    console.warn("Game Studio could not update draft status.", error);
    window.alert(`Draft status was not changed: ${error.message}`);
  } finally {
    draftStatusUpdatingKey = "";
    renderDetail();
  }
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
  renderDrafts(game);
  renderReadyBoard(game);
  renderWorkflow(game);
  renderAttention();
  renderSuiteAnalytics();
  renderBranchCleanupStatus();
}

function renderPortal() {
  renderGameList();
  renderDetail();
}

function renderBranchCleanupStatus() {
  if (!branchCleanupStatus || !clearUnchangedBranchesButton) return;

  const clearable = clearableDraftBranches();
  clearUnchangedBranchesButton.disabled = !clearable.length;
  branchCleanupStatus.textContent =
    branchCleanupMessage ||
    (clearable.length
      ? `${clearable.length} unchanged test ${clearable.length === 1 ? "branch" : "branches"} can be hidden.`
      : "No unchanged test branches need cleanup.");
}

function clearUnchangedBranches() {
  const clearable = clearableDraftBranches();

  if (!clearable.length) {
    branchCleanupMessage = "No unchanged test branches need cleanup.";
    renderBranchCleanupStatus();
    return;
  }

  const confirmed = window.confirm(
    `Hide ${clearable.length} unchanged test ${
      clearable.length === 1 ? "branch" : "branches"
    } from this Command Center view? This keeps live database rows untouched.`
  );

  if (!confirmed) return;

  clearable.forEach(({ gameId, row }) => {
    hiddenDraftBranchKeys.add(draftRowKey(gameId, row.draft_id));
  });

  saveHiddenDraftBranches();
  branchCleanupMessage = `Cleared ${clearable.length} unchanged test ${
    clearable.length === 1 ? "branch" : "branches"
  } from this view.`;
  renderPortal();
}

function closeStudioViews() {
  studioViews.forEach((view) => {
    view.classList.remove("is-open");
    view.setAttribute("aria-hidden", "true");
  });
  document.body.classList.remove("view-open");
}

function openStudioView(viewId) {
  const view = document.getElementById(viewId);
  if (!view) return;

  closeStudioViews();
  view.classList.add("is-open");
  view.setAttribute("aria-hidden", "false");
  document.body.classList.add("view-open");
  const closeButton = view.querySelector("[data-close-view]");
  if (closeButton) closeButton.focus();
}

function setupStudioViews() {
  openViewButtons.forEach((button) => {
    button.addEventListener("click", () => openStudioView(button.dataset.openView));
  });

  closeViewButtons.forEach((button) => {
    button.addEventListener("click", closeStudioViews);
  });

  studioViews.forEach((view) => {
    view.addEventListener("click", (event) => {
      if (event.target === view) closeStudioViews();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeStudioViews();
  });
}

function setupBranchCleanup() {
  if (clearUnchangedBranchesButton) {
    clearUnchangedBranchesButton.addEventListener("click", clearUnchangedBranches);
  }
}

setupStudioViews();
setupBranchCleanup();
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

async function loadDraftRows() {
  const config = draftConfig();
  if (!config) {
    return;
  }

  try {
    const entries = await Promise.all(
      Object.entries(draftSources).map(async ([gameId, source]) => {
        const query = [
          `select=${source.select}`,
          "order=updated_at.desc",
          "limit=20"
        ].join("&");
        const response = await fetch(
          `${config.supabaseUrl}/rest/v1/${source.table}?${query}`,
          {
            headers: {
              apikey: config.supabaseAnonKey,
              Authorization: `Bearer ${config.supabaseAnonKey}`
            }
          }
        );

        if (!response.ok) {
          return [gameId, []];
        }

        const rows = await response.json();
        return [gameId, Array.isArray(rows) ? rows : []];
      })
    );

    draftRowsByGame = Object.fromEntries(entries);
    draftsConfigured = true;
    renderDetail();
  } catch (_error) {
    draftsConfigured = false;
  }
}

loadDraftRows();
