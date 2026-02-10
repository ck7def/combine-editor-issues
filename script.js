const agentProfiles = {
  aurora: {
    label: "Aurora — Revenue Ops",
    style: "Precision, crisp, metric-focused",
    responses: [
      "I’ll orchestrate CRM, billing, and product events to keep the pipeline clean. What’s the ARR target?",
      "Let’s run a retention sweep: flag churn-risk accounts, schedule reach-outs, and prep talk tracks.",
      "I can generate an MBR deck with deal health, blockers, and next-best actions within minutes."
    ],
  },
  nova: {
    label: "Nova — Product Strategist",
    style: "Vision-led, experiment-first",
    responses: [
      "Let’s frame this as a thin-slice pilot. Which user segment should we target first?",
      "I’ll synthesize customer quotes and telemetry into a 5-point decision doc.",
      "Here’s a blueprint: discovery → prototype → usability loop → alpha metrics → scale gates."
    ],
  },
  onyx: {
    label: "Onyx — Service Desk",
    style: "Empathetic, policy-aware",
    responses: [
      "Routing the request with SLA-aware prioritization. Do we need a human handoff on this one?",
      "I’ll verify entitlements, trigger diagnostics, and return the fix steps with links.",
      "Escalation is ready—summarizing history, sentiment, and device state for the live agent."
    ],
  },
};

const twinProfiles = {
  atlas: {
    label: "Atlas — Platform VP",
    strengths: "Architecture, governance, partner diligence.",
  },
  muse: {
    label: "Muse — Creative Lead",
    strengths: "Brand tone, narratives, and multi-market alignment.",
  },
  horizon: {
    label: "Horizon — RevOps Director",
    strengths: "Sequencing, scoring, forecasting, and playbooks.",
  },
  aster: {
    label: "Aster — CX Director",
    strengths: "Sentiment, SLAs, and omnichannel care.",
  },
};

const chatLog = document.getElementById("chatLog");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const agentSelect = document.getElementById("agentSelect");
const twinSelect = document.getElementById("twinSelect");
const statusText = document.getElementById("statusText");
const agentLabel = document.getElementById("agentLabel");
const quickActionButtons = document.querySelectorAll("[data-prompt]");

function setStatus(text) {
  statusText.textContent = text;
}

function updateAgentLabel() {
  const agent = agentProfiles[agentSelect.value];
  const twin = twinProfiles[twinSelect.value];
  agentLabel.textContent = `${agent.label.split(" — ")[0]} + ${twin.label.split(" — ")[0]}`;
}

function createBubble({ sender, message }) {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  if (sender === "You") bubble.classList.add("bubble--user");

  const meta = document.createElement("span");
  meta.className = "bubble__meta";
  meta.textContent = sender;
  bubble.appendChild(meta);

  const text = document.createElement("div");
  text.textContent = message;
  bubble.appendChild(text);

  chatLog.appendChild(bubble);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function agentReply(userMessage) {
  const agent = agentProfiles[agentSelect.value];
  const twin = twinProfiles[twinSelect.value];
  const toggles = {
    realtime: document.getElementById("toggleRealtime").checked,
    autonomy: document.getElementById("toggleAutonomy").checked,
    tools: document.getElementById("toggleTools").checked,
  };

  const hints = [
    toggles.realtime ? "realtime voice is enabled" : "voice is paused",
    toggles.autonomy ? "autonomy allowed" : "manual confirmation required",
    toggles.tools ? "tool access is active" : "tooling sandboxed",
  ];

  const response =
    `${agent.responses[Math.floor(Math.random() * agent.responses.length)]} ` +
    `Digital twin context: ${twin.strengths}. ` +
    `Settings → ${hints.join(" · ")}. ` +
    `I’ll start by paraphrasing your request: "${userMessage}".`;

  createBubble({ sender: agent.label, message: response });
  setStatus("Ready to respond");
}

function handleSubmit(event) {
  event.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  createBubble({ sender: "You", message });
  chatInput.value = "";
  setStatus("Thinking with chain-of-actions...");

  setTimeout(() => agentReply(message), 600);
}

chatForm.addEventListener("submit", handleSubmit);
agentSelect.addEventListener("change", updateAgentLabel);
twinSelect.addEventListener("change", updateAgentLabel);

quickActionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    chatInput.value = button.dataset.prompt;
    chatInput.focus();
  });
});

// Seed the chat with a sample conversation
function seedConversation() {
  const sample = [
    { sender: "You", message: "Show me how a digital twin collaborates with a super agent for onboarding." },
    {
      sender: agentProfiles[agentSelect.value].label,
      message:
        "Pairing Atlas for architecture guardrails. I’ll orchestrate the onboarding flow, validate access policies, and surface risk checks in-line.",
    },
    {
      sender: "Atlas — Platform VP",
      message: "I’ll enforce authentication steps, make sure data paths are encrypted, and flag any integration drift before we go live.",
    },
  ];

  sample.forEach(createBubble);
}

updateAgentLabel();
seedConversation();
